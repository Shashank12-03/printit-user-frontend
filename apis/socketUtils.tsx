import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

type MessageSetter = (messages: Message[] | ((prev: Message[]) => Message[])) => void;

type JoinFailureData = {
  error: string;
};

interface Message {
  id: string;
  type: 'file' | 'text';
  content: string;
  fileName?: string;
  fileSize?: number;
  timestamp: Date;
  sender: 'user' | 'shop';
}
const SocketUrl ="http://192.168.14.135:5000";

export const connectSocket = (
) => {-
  console.log('in connection socket');
  socket = io( SocketUrl, {
    query: { userType: 'user' },
  });

  socket.on('connect', () => {
    console.log('Connected to WebSocket server');
  });

  socket.on('message', (message: Message) => {
    console.log(message);
  });

  socket.on('error', (err: Error) => {
    return Alert.alert('error', err.message);
  });

  socket.on('join_success', (data: any) => {
    console.log('Join success:', data);
  });

  socket.on('join_failure', (data: JoinFailureData) => {
    console.log('Join failure:', data);
  });
};

export const handleJoin = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  if (!token) {
    console.log('token not found');
    Alert.alert('Error', 'Failed to join');
  }
  if (!socket) {
    console.log('socket connection couldnt extablished');
    Alert.alert('Error', 'Failed to join');
    return false;
  }
  socket.emit('join', { token, userType: 'user' });
  return true;
};

export const sendFile = (
  fileData: string | ArrayBuffer | null,
  file: { name: string; size: number },
  shopId: string,
  user: {userId:string, userName:string, userImage:string}
) => {
  if (socket) {
    console.log('Sending file:', file.name, 'from user:', user.userName, 'to shop:', shopId);
    socket.emit('sendFile', {
      id: new Date().toISOString(),
      type: 'file',
      content: '',
      fileName: file.name,
      fileSize: file.size,
      timestamp: new Date(),
      sender: 'user',
      file: fileData,
      shopId,
      user,
    });
  }
};
