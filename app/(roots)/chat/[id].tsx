import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Platform, SafeAreaView, KeyboardAvoidingView, ImageBackground } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { router, useLocalSearchParams } from 'expo-router';
import icons from '@/constants/icons';
import PDFPreview from '@/components/pdf-view';
import images from '@/constants/images';
import { connectSocket, handleJoin,sendFile } from "@/apis/socketUtils";
import { getUser } from '@/lib/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface Message {
  id: string;
  type: 'file' | 'text';
  content: string;
  fileName?: string;
  fileSize?: number;
  timestamp: Date;
  sender: 'user' | 'shop';
}

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  mobile_no: string;
}

export default function ChatScreen() {
  
  const { id, shopName, shopImage } = useLocalSearchParams<{ id: string; shopName: string; shopImage: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [joinUser, setJoinUser] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const saveMessagesToStorage = async (messages: Message[]) => {
    try {
      await AsyncStorage.setItem(`messages_${id}`, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving messages to storage:', error);
    }
  };

  const loadMessagesFromStorage = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem(`messages_${id}`);
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages).map((message: Message) => ({
          ...message,
          timestamp: new Date(message.timestamp), // Convert timestamp back to Date
        }));
        setMessages(parsedMessages);
      }
    } catch (error) {
      console.error('Error loading messages from storage:', error);
    }
  };

  useEffect(() => {
    loadMessagesFromStorage();
  }, [id]);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: true,
      });

      if (result.assets) {
        result.assets.forEach(async (asset) => {
          try {
            const response = await fetch(asset.uri);
            const blob = await response.blob();

            const reader = new FileReader();
            reader.readAsDataURL(blob);

            reader.onloadend = () => {
              const fileData = reader.result;

              const newMessage: Message = {
                id: Math.random().toString(),
                type: 'file',
                content: asset.uri,
                fileName: asset.name,
                fileSize: asset.size,
                timestamp: new Date(),
                sender: 'user',
              };

              setMessages((prev) => {
                const updatedMessages = [newMessage, ...prev];
                saveMessagesToStorage(updatedMessages);
                return updatedMessages;
              });

              if (id && user?.id) {
                sendFile(fileData, { name: asset.name, size: asset.size ?? 0 }, id, {"userId":user.id, "userName":user.name, "userImage":user.image});
              } else {
                console.error('Error: Missing id or user id');
              }
            };
          } catch (fileError) {
            console.error('Error reading file:', fileError);
          }
        });
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  useEffect(() => {
    console.log('socket connection useeffect');
    connectSocket();
    if (!joinUser) {
      const joinSocket = async () => {
        const joinUser = await handleJoin();
        console.log('joinUser', joinUser);
        setJoinUser(true);
      };
      joinSocket();
    }
  }, [joinUser]);

  useEffect(() => {
    if (!user) {
      const fetchUser = async () => {
        const loggedUser = await getUser();
        setUser(loggedUser.user);
        setIsLoggedIn(true);
      };
      fetchUser();
    }
  }, [isLoggedIn]);

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    return (
      <View className={`max-w-[80%] mx-4 my-1 ${isUser ? 'self-end' : 'self-start'}`}>
        {item.type === 'file' && (
          <PDFPreview
            fileName={item.fileName || 'Unknown'}
            fileSize={`${((item.fileSize ?? 0) / 1024).toFixed(1)} KB`}
            onView={() => console.log('View PDF:', item.content)}
          />
        )}
        <Text className={`text-xs text-textSecondary mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {item.timestamp
            ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'Unknown Time'}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <View className="flex-row items-center justify-between p-4 border-b border-border mt-5">
          <View className="flex flex-row items-center px-2 mr-2">
            <TouchableOpacity onPress={() => router.back()}>
              <Image source={icons.backArrow} className="w-7 h-9" />
            </TouchableOpacity>
          </View>
          <Image source={{ uri: shopImage }} className="size-12 rounded-full" />
          <View className="flex flex-col items-start ml-2 justify-center ml-4">
            <Text className="text-xl font-rubik-bold">{shopName}</Text>
            <Text className="text-s">Online</Text>
          </View>
          <View className="flex-1 flex-row justify-end">
            <TouchableOpacity onPress={() => console.log('share button')}>
              <Image source={icons.send} className="w-8 h-8 mr-2" />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          inverted={messages.length > 0}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <View className="flex-row items-center justify-center border-black">
            <Text className="flex-1 justify-center text-lg text-center text-primary-300 font-rubik-medium ml-4">
              Select files and send
            </Text>
            <View className="flex-1 flex-row items-center justify-end border border-white bg-primary-300 m-4 py-2 pr-6">
              <TouchableOpacity onPress={pickDocument} className="py-3 items-center">
                <View className="flex items-center justify-center mr-8">
                  <Text className="flex text-white items-center justify-center text-center text-lg font-rubik-medium">
                    Select files
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}