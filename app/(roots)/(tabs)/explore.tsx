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
  shop_id:string;
  shopImages:ImageSourcePropType[];
  shop_rating:number; 
  shop_name:string;
  shop_address:string;
  distance_km:number;
}

export default function Explore() {
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

  const handleCardPress = (id: string) => router.push(`/shops/${id}`);
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
              <TouchableOpacity onPress={()=> router.back()} className="flex flexr-row bg-primary-200 rounded-full size-11 items-center justify-center">
                <Image source={icons.backArrow} className="size-5"/>
              </TouchableOpacity>
              <Text className="text-base mr-2 text-center font-rubik-medium text-blac-300">
                Search for your shop
              </Text>
              <Image source={icons.bell} className="w-6 h-6"/>
            </View>
            <Search/>
            <View className="mt-5">
              <Text className="text-xl font-rubik-bold text-black-300 mt-5">
                Found {shops?.length} Shops
              </Text>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}