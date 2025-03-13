import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URI = "http://192.168.11.247:8000";

let googleToken: string | null = null; 

export const sendTokenToBackend = async (token: string) => {
    try {

        googleToken = token; 
        console.log('Sending token to backend:', googleToken);
        const response = await axios.post(`${API_URI}/user/auth`, { token });
        if (response.status !== 200) {
            console.error('Error fetching credentials:', response.statusText);
            return null;
        }
        return response.data;

    } catch (error) {
        console.error('Error fetching credentials:', error);
        return null;
    }
}

export const signInWithEmailAndPassword = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URI}/user/email-login`, { email, password });
        if (response.status !== 200) {
            console.error('Error fetching credentials:', response.statusText);
            return false;
        }
        await AsyncStorage.setItem('isLoggedIn', 'true');
        return true;
    } catch (error) {
        console.error('Error fetching credentials:', error);
        return false;
    }
}

export const getToken = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URI}/user/get-token`, { email, password });
        if (response.status !== 200) {
            console.error('Error fetching credentials:', response.statusText);
            return null;
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching credentials:', error);
        return null;
    }
}

export const getCurrentUser = async () => {
    if (!googleToken) {
        console.error('Google token is not set');
        return null;
    }

    try {
        const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${googleToken}`,
            },
        });
        return response.data;
    } catch (error) {
        const err = error as any;
        console.error('Error fetching user info:', err.response?.data || err.message);
        return null;
    }
}

// const getRefreshToken = async () => {
//     let refreshToken;
//     if (Platform.OS === 'web') {
//         refreshToken = localStorage.getItem('refreshToken');
//     }
//     else {
//         refreshToken = await AsyncStorage.getItem('refreshToken');
//     }
//     if (!refreshToken) {
//         console.error('refresh token is not set');
//         return false;
//     }
//     try {
//         const response = await axios.post(`${API_URI}/user/token-refresh`,{
//             "refresh": refreshToken
//         });
//         if (response.status !== 200) {
//             console.error('Error fetching access token: ', response.statusText);
//             return false;
//         }
//         const responseData = response.data;
//         if (Platform.OS === 'web') {
//             localStorage.setItem('accessToken', responseData.access);
//             localStorage.setItem('refreshToken', responseData.refresh);
//         } else {
//             console.log('Setting SecureStore'); 
//             await AsyncStorage.setItem('accessToken', responseData.access);
//             await AsyncStorage.setItem('refreshToken', responseData.refresh);
//         }
//         return true;

//     } catch (error) {
//         const err = error as any;
//         console.error('Error fetching refresh token:', err.response?.data || err.message);
//         return null;
//     }
// }

export const getCurrentUserNormal = async () => {
    let accessToken;
    if (Platform.OS === 'web') {
        accessToken = localStorage.getItem('accessToken');
    }
    else {
        accessToken = await AsyncStorage.getItem('accessToken');
    }
    if (!accessToken) {
        console.error('Google token is not set');
        return null;
    }
    try {
        const response = await axios.get(`${API_URI}/user/get-user`,{
            headers: {
              Authorization: `Bearer ${accessToken}`
            },
        });
        await AsyncStorage.setItem('isLoggedIn', 'true');
        await AsyncStorage.setItem('user',JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        const err = error as any;
        console.error('Error fetching user info:', err.response?.data || err.message);
        return null;
    }
}

// const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQxNTE3NzIzLCJpYXQiOjE3NDE0MzEzMjMsImp0aSI6ImM4ZmNlM2IzYmI4MDQ1MDZiYmY3ZWM4MWY2NzFjNTUxIiwidXNlcl9pZCI6Mn0.vBGXdDvkanembbZ9cKDhNemUsiN-3qZYtvfSbHwy9oA";

export const getShops = async (latitude: any,longitude: any) => {
    let accessToken;
    if (Platform.OS === 'web') {
        accessToken = localStorage.getItem('accessToken');
    }
    else {
        console.log('Getting access token from Async storage in shops');
        accessToken = await AsyncStorage.getItem('accessToken');
        console.log('access token', accessToken);
    }
    try {
        const data = {
            longitude: longitude,
            latitude: latitude
        }
        console.log('Fetching shops:', data);
        const response = await axios.get(`${API_URI}/shop/get-shops`,{
            headers: {
              Authorization: `Bearer ${accessToken}`
            },
            params:data
        });
        if (response.status!=200) {
            console.error('Error fetching shops: ', response.statusText);
            return null;
        }
        const shops = response.data.shop_list;
        return shops;
    } catch (error) {
        console.error('Error fetching shops:', error);
        return null;
    }
}

export const getShopById = async (id: number) => {
    console.log("Fetching shop with ID:", id);  
    let accessToken = await AsyncStorage.getItem('accessToken');
    
    const requestUrl = `${API_URI}/shop/get-shop/${id}`;
    console.log("Request URL:", requestUrl);

    try {
        const response = await axios.get(requestUrl, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (response.status !== 200) {
            console.error("Error fetching shop:", response.statusText);
            return null;
        }
        return response.data;
    } catch (error) {
        const err = error as any;
        console.error("Error fetching shop by id:", err.response?.data || err.message);
        return null;
    }
};

