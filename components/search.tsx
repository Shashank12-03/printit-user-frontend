import { View, Text,Image, TextInput} from 'react-native';
import React from 'react';
import { useState } from 'react';
import { router, useLocalSearchParams, usePathname } from 'expo-router'
import icons from '@/constants/icons';
import { useDebouncedCallback } from 'use-debounce';

const Search = () => {
  const path = usePathname();
  const params = useLocalSearchParams<{query?:string}>();
  const [search, setSearch] = useState(params.query || '');
  const debounceSearch = useDebouncedCallback((text:string) => router.setParams({query:text}), 500);
  const handlSearch = (text:string) => {
    setSearch(text);
    debounceSearch(text);
}
  return (
    <View className='flex flex-row items-center justify-between w-full px-4 rounded-lg bg-accent-100 border border-primary-100 mt-5 py-2'>
        <View className='flex-1 flex flex-row items-center justify-start z-50'>
            <Image source={icons.search} className='size-5'/>
            <TextInput
                value={search}
                onChangeText={handlSearch}
                placeholder='Search'
                placeholderTextColor='gray'
                className='text-sm font-rubik text-black-300 mt-2 flex-1'
            />
        </View>
    </View>
  )
}

export default Search;
