import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import { Redirect, router } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import images from '@/constants/images';
import icons from '@/constants/icons';
import React, { useEffect, useState, useRef } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import SecureStore from 'expo-secure-store';
import { sendTokenToBackend, signInWithEmailAndPassword, getToken, getCurrentUserNormal } from '@/apis/userApis';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
// import { useGlobalContext } from '@/lib/global-provider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GOOGLE_Android_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_Android_CLIENT_ID;
const GOOGLE_WEBSITE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEBSITE_CLIENT_ID;

WebBrowser.maybeCompleteAuthSession();

const SignIn = () => {
  console.log('SignIn component rendered');
  console.log('Google Android Client ID:', GOOGLE_Android_CLIENT_ID);
  console.log('Google Website Client ID:', GOOGLE_WEBSITE_CLIENT_ID);
  useEffect(() => {
    const checkLoggedIn = async () => {
      const user = await getCurrentUserNormal();
      if (user) {
        router.push('/');
      }
    };
    checkLoggedIn();
  }, []);


  const [authLoading, setAuthLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:GOOGLE_Android_CLIENT_ID,
    webClientId:GOOGLE_WEBSITE_CLIENT_ID,
  });

  useEffect(() => {
    if (response) {
      handleResponse(response);
    }
  }, [response]);

  const handleResponse = async (response: any) => {
    if (response?.type === 'success') {
      setAuthLoading(true);
      const token = response.authentication?.accessToken;
      console.log('Google Token:', token);
      const responseData = await sendTokenToBackend(token);
      console.log('Response Data:', responseData);

      if (!responseData) {
        console.error('Invalid response from backend');
        setAuthLoading(false);
        return;
      }

      if (Platform.OS === 'web') {
        if (responseData.token) {
          localStorage.setItem('accessToken', responseData.token.access);
          localStorage.setItem('refreshToken', responseData.token.refresh);
        }
        if (responseData.user) {
          localStorage.setItem('@user', JSON.stringify(responseData.user));
        }
      } else {
        if (responseData.token) {
          await AsyncStorage.setItem('accessToken', responseData.token.access);
          await AsyncStorage.setItem('refreshToken', responseData.token.refresh);
        }
        if (responseData.user) {
          await AsyncStorage.setItem('@user', JSON.stringify(responseData.user));
        }
      }

      const user = await getCurrentUserNormal();
      console.log('User Data:', user);
  
      if (!user?.name || !user?.mobile_no || !user?.profile_photo) {
        // Redirect to onboarding page if user is new
        router.push("/onboarding");
      } else {
        router.push("/");
      }

      // await refetch({});
      setAuthLoading(false);
    } else {
      console.error('Google Sign-In Error:', response);
    }
  };

  const handleLogin = async () => {
    if (!request) {
      console.error('Google login request is not initialized');
      return;
    }

    console.log('Login');
    const result = await promptAsync();
    console.log('Result:', result);
    if (result?.type !== 'success') {
      Alert.alert("Error", "Failed to login");
    }
  };

  const handleEmailPasswordLogin = async () => {
    setAuthLoading(true);
    try {
      const responseData = await signInWithEmailAndPassword(email, password);
  
      if (!responseData) {
        console.error('Invalid response from backend');
        setAuthLoading(false);
        return;
      }
  
      const tokenResponse = await getToken(email, password);
      console.log('Token Response:', tokenResponse);
      if (!tokenResponse) {
        console.error('Invalid token response from backend');
        setAuthLoading(false);
        return;
      }
  
      // Save tokens to AsyncStorage
      if (Platform.OS === 'web') {
        localStorage.setItem('accessToken', tokenResponse.access);
        localStorage.setItem('refreshToken', tokenResponse.refresh);
      } else {
        console.log('Setting SecureStore');
        await AsyncStorage.setItem('accessToken', tokenResponse.access);
        await AsyncStorage.setItem('refreshToken', tokenResponse.refresh);
      }
  
      // Check if the user is new (e.g., missing required fields)
      const user = await getCurrentUserNormal();
      console.log('User Data:', user);
  
      if (!user?.name || !user?.mobile_no || !user?.profile_photo) {
        // Redirect to onboarding page if user is new
        router.push("/onboarding");
      } else {
        // Redirect to the main app if user is complete
        router.push("/");
      }
  
      setAuthLoading(false);
    } catch (error) {
      console.error('Email/Password Sign-In Error:', error);
      setAuthLoading(false);
    }
  };


  return (
    <SafeAreaView className="h-full" style={{ backgroundColor: '#531A08' }}>
      <ScrollView contentContainerClassName="h-full">
        <Image source={images.icon} className="w-full h-4/6" resizeMode="contain" />
        <View className="px-10">
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            className="bg-white rounded-full w-full py-4 mt-5 px-4"
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="bg-white rounded-full w-full py-4 mt-5 px-4"
          />
          <TouchableOpacity
            onPress={handleEmailPasswordLogin}
            className="bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5"
          >
            <View className="flex flex-row justify-center items-center">
              <Text className="text-lg font-rubik-medium text-black-300 ml-2">
                Sign In with Email
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLogin}
            className="bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5"
          >
            <View className="flex flex-row justify-center items-center">
              <Image source={icons.google} className="w-5 h-5" resizeMode="contain" />
              <Text className="text-lg font-rubik-medium text-black-300 ml-2">
                Continue with Google
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;