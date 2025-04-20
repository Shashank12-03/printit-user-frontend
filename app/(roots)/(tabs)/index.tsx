import { Card, FeaturedCard} from "@/components/cards";
import NoResult from "@/components/no-result";
import Search from "@/components/search";
import icons from "@/constants/icons";
import images from "@/constants/images";
// import { useGlobalContext } from "@/lib/global-provider";
import { getCurrentUserNormal, getFavourtiteShops, getShops } from "@/apis/userApis";
import { Link, router } from "expo-router";
import { Text, View, Image, TouchableOpacity, FlatList, ActivityIndicator, Alert, ImageSourcePropType } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { getUser } from "@/lib/auth";
import Avatar from "@/components/avatar";
import AvatarMain from "@/components/avatarMain";

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  mobile_no: string;
}

interface Shops {
  id:number;
  images__images:ImageSourcePropType[];
  rating:number; 
  name:string;
  location__address:string;
  distance_km:number;
}

interface FavouriteShops {
  shop__id:number;
  shop__images__images:ImageSourcePropType[];
  shop__rating:number; 
  shop__name:string;
  shop__location__address:string;
}

export default function Index() {
  // const { user } = useGlobalContext();
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [shops, setShops] = useState<Shops[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [favShopLoading, setfavShopLoading] = useState(true);
  const [locationFetched, setLocationFetched] = useState(false);
  const [favouriteShops, setFavouriteShops] = useState<FavouriteShops[] | null>(null);
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
        const favouriteShops = await getFavourtiteShops();
        setFavouriteShops(favouriteShops);
        setfavShopLoading(false);
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
        renderItem={({ item }) => <Card item={item} onPress={() => handleCardPress(item.id)} />}
        keyExtractor={(item) => item.id.toString()}
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
                <TouchableOpacity onPress={() => router.push("/profile")}>
                  {user?.image ? <Image source={{ uri: user.image }} className="size-12 rounded-full" /> : <AvatarMain name={user?.name || ""}/>}
                </TouchableOpacity>
                <View className="flex flex-col items-start ml-2 justify-center">
                  <Text className="font-bold text-lg">Hello, {user?.name}</Text>
                  <Text className="text-gray-500">Welcome</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => router.push("/scanner")}>
                <Image source={icons.qrcode} className="size-10" />
              </TouchableOpacity>
            </View>
            <Search />
            <View className="my-5">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-xl font-rubik-bold text-black-300">Favourite</Text>
                <TouchableOpacity>
                  <Text className="text-base font-rubik-bold">View all</Text>
                </TouchableOpacity>
              </View>
              {favShopLoading ? (
                <ActivityIndicator size="large" className="text-primary-300" />
              ) : !favouriteShops || favouriteShops.length === 0 ? (
                <Text className="flex text-center text-xl font-rubik-medium text-black-300 mt-5 mb-5">No favourite shops for now</Text>
              ) : (
                <FlatList
                  data={favouriteShops}
                  renderItem={({ item }) => <FeaturedCard item={item} onPress={() => handleCardPress(item.shop__id)} />}
                  keyExtractor={(item) => item.shop__id.toString()}
                  horizontal
                  bounces={false}
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName="flex gap-5 mt-5"
                />
              )}
              
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