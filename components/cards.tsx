import { View, Text, TouchableOpacity,Image, ImageSourcePropType } from 'react-native'
import React from 'react'
import images from '@/constants/images';
import icons from '@/constants/icons';

interface Props {
    item: {
        shop_id:number;
        shopImages:ImageSourcePropType[];
        shop_rating:number; 
        shop_name:string;
        shop_address:string;
        distance_km:number;
    };
    onPress?: () => void;
}

export const FeaturedCard = ({item :{shopImages, shop_rating, shop_name, shop_address, distance_km}, onPress}:Props) => {
  return (
    <TouchableOpacity onPress={onPress} className='flex flex-col items-start w-60 h-80 relative'>
        <Image source={images.xerox1} className='size-full rounded-2xl'/>
        <Image source={images.cardGradient} className='size-full rounded-2xl absolute bottom-0'/>
        <View className='flex flex-row items-center bg-white/90 px-3 py-1.5 rounded-full absolute top-5 right-5'>
            <Image source={icons.star} className='size-3.5'/>
            <Text className='text-xs font-rubik-bold text-primary-300 ml-1'>{shop_rating.toFixed(1)}</Text>
        </View>
        <View className='flex flex-col items-start absolute bottom-5 inset-x-5'>
            <Text className='text-xl font-rubik-extrahold text-white' numberOfLines={1}>{shop_name}</Text>
            <Text className='text-base font-rubik text-white'numberOfLines={2}>{shop_address}</Text>
            <View className="flex flex-row items-center justify-between w-full">
                <Text className="text-xl font-rubik-extrabold text-white">
                {distance_km.toFixed(1)} km
                </Text>
            </View>
        </View>
    </TouchableOpacity>
  )
}

export const Card = ({item :{shopImages, shop_rating, shop_name, shop_address, distance_km}, onPress}:Props) => {
    return (
        <TouchableOpacity onPress={onPress} className='flex-1 w-full mt-4 px-3 py-4 rounded-lg bg-white shadow-lg shadow-black-100/70 relative'>
            <View className='flex flex-row items-center absolute px-2 top-5 right-5 bg-white/90 p-1 rounded-full z-50'>
                <Image source={icons.star} className='size-2.5'/> 
                <Text className='text-xs font-rubik-bold text-primary-300 ml-0.5'>{shop_rating.toFixed(1)}</Text>
            </View>
            <Image source={images.xerox2} className='w-full h-40 rounded-lg'/>
            <View className='flex flex-col mt-2'>
                <Text className='text-base font-rubik-hold text-black-300'numberOfLines={1} >{shop_name}</Text>
                <Text className='text-xs font-rubik text-black-200' numberOfLines={2}>{shop_address}</Text>
                <View className='flex flex-row items-center justify-between mt-2'>
                    <Text className='text-base font-rubik-bold text-primary-300'>{distance_km.toFixed(1)} km</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
  }

