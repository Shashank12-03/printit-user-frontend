import { Card, FeaturedCard} from "@/components/cards";
import NoResult from "@/components/no-result";
import Search from "@/components/search";
import icons from "@/constants/icons";
import images from "@/constants/images";
// import { useGlobalContext } from "@/lib/global-provider";
import { getCurrentUserNormal, getShops } from "@/apis/userApis";
import { Link, router } from "expo-router";
import { Text, View, Image, TouchableOpacity, FlatList, ActivityIndicator, Alert, ImageSourcePropType } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { getUser } from "@/lib/auth";

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  mobile_no: string;
}

interface Shops {
  shop_id:number;
  shopImages:ImageSourcePropType[];
  shop_rating:number; 
  shop_name:string;
  shop_address:string;
  distance_km:number;
}

export default function Index() {
  // const { user } = useGlobalContext();
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [shops, setShops] = useState<Shops[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationFetched, setLocationFetched] = useState(false);

  useEffect(() => {
    const fetchLocationAndShops = async () => {
      try {
        console.log('ineffect index shop');
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Error', 'Permission to access location was denied');
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const shopsData = await getShops(location.coords.latitude, location.coords.longitude);
        setLocationFetched(true);
        setShops(shopsData);
      } catch (error) {
        console.error('Error fetching location or shops:', error);
        Alert.alert('Error', 'Failed to fetch location or shops');
      } finally {
        setLoading(false);
      }
    };
    if (!locationFetched) {
      fetchLocationAndShops();
    }
  }, [locationFetched]);

  useEffect(() => {
    if (!user) {
      console.log('ineffect index user');
      const fetchUser = async () => {
        const loggedUser = await getUser();
        setUser(loggedUser.user); 
        setIsLoggedIn(true);
        setLoading(false);
      }
      fetchUser();
    }
  }, [isLoggedIn]);

  const handleCardPress = (id: number) => router.push(`/shops/${id}`);
  console.log(loading);

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={shops}
        renderItem={({ item }) => <Card item={item} onPress={() => handleCardPress(item.shop_id)} />}
        keyExtractor={(item) => item.shop_id.toString()}
        numColumns={2}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
          <ActivityIndicator size="large" className="text-primary-300 mt-5"/>
        ) : <NoResult />}
        ListHeaderComponent={
          <View className="px-5">
            <View className="flex flex-row items-center justify-between mt-5">
              <View className="flex flex-row items-center">
                <Image source={user?.image ? { uri: user.image } : images.avatar} className="size-12 rounded-full" />
                <View className="flex flex-col items-start ml-2 justify-center">
                  <Text className="font-bold text-lg">Hello, {user?.name}</Text>
                  <Text className="text-gray-500">Welcome</Text>
                </View>
              </View>
              <Image source={icons.bell} className="size-6" />
            </View>
            <Search />
            <View className="my-5">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-xl font-rubik-bold text-black-300">Recent</Text>
                <TouchableOpacity>
                  <Text className="text-base font-rubik-bold">View all</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={shops}
                renderItem={({ item }) => <FeaturedCard item={item} onPress={() => handleCardPress(item.shop_id)} />}
                keyExtractor={(item) => item.shop_id.toString()}
                horizontal
                bounces={false}
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="flex gap-5 mt-5"
              />
            </View>
            <View className="flex flex-row items-center justify-between">
              <Text className="text-xl font-rubik-bold text-black-300">Shops</Text>
              <TouchableOpacity>
                <Text className="text-base font-rubik-bold">See all</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}