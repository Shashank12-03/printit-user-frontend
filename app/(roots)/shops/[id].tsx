import { FlatList, Image, ScrollView, Text, TouchableOpacity, View, Dimensions, Platform, ImageSourcePropType, Linking, SafeAreaView, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import icons from "@/constants/icons";
import images from "@/constants/images";
import Comment from "@/components/comment";
import { facilities } from "@/constants/data";
import { useEffect, useState } from "react";
import { getShopById } from "@/apis/userApis";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

interface Shop {
  shop_id: string;
  shop_name: string;
  shop_address: string;
  shop_images: ImageSourcePropType[];
  location: {
    latitude: number;
    longitude: number;
  };
  shop_rating: number;
  shop_facilites: { [key: string]: number };
  shop_paymentmodes: string[];
}

const Property = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const windowHeight = Dimensions.get("window").height;

  const mapStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    }
  ];
  
  useEffect(() => {
    if (loading) {
      const fetchShopDetails = async () => {
        if (id) {
          const shopId = parseInt(id, 10);
          if (isNaN(shopId)) {
            console.error("Invalid shop ID:", id);
            setLoading(false);
            return;
          }
          const shopDetails = await getShopById(shopId);
          setShop(shopDetails?.shop || null);
          setLatitude(shopDetails?.shop.location.latitude);
          setLongitude(shopDetails?.shop.location.longitude);
        } else {
          console.error("Shop ID is undefined");
        }
        setLoading(false);
      };
      fetchShopDetails();
    }
  }, [loading]);  

  console.log(shop);
  console.log('latitude ',latitude);
  console.log('longitude ',longitude);

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  if (loading) {
    return (
      <SafeAreaView className="bg-white h-full flex justify-center items-center">
        <ActivityIndicator className="text-primary-300" size="large" />
      </SafeAreaView>
    );
  }

  return (
    <View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 bg-white"
      >
        <View className="relative w-full" style={{ height: windowHeight / 2 }}>
          <Image
            // source={ shop?.shop_images[0] }
            source={
              typeof shop?.shop_images[0] === 'string' 
                ? { uri: shop.shop_images[0] } 
                : shop?.shop_images[0]
            }
            className="size-full"
            resizeMode="cover"
          />
          <Image
            source={images.whiteGradient}
            className="absolute top-0 w-full z-40"
          />

          <View
            className="z-50 absolute inset-x-7"
            style={{
              top: Platform.OS === "ios" ? 70 : 20,
            }}
          >
            <View className="flex flex-row items-center w-full justify-between">
              <TouchableOpacity
                onPress={() => router.back()}
                className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center"
              >
                <Image source={icons.backArrow} className="size-5" />
              </TouchableOpacity>

              <View className="flex flex-row items-center gap-3">
                <Image
                  source={icons.heart}
                  className="size-7"
                  tintColor={"#191D31"}
                />
                <Image source={icons.send} className="size-7" />
              </View>
            </View>
          </View>
        </View>

        <View className="px-5 mt-7 flex gap-2">
          <Text className="text-2xl font-rubik-extrabold">
            {shop?.shop_name}
          </Text>

          <View className="flex flex-row items-center gap-3">
            <View className="flex flex-row items-center px-4 py-2 bg-primary-100 rounded-full">
              <Text className="text-xs font-rubik-bold text-primary-300">
                Xerox shop
              </Text>
            </View>

            <View className="flex flex-row items-center gap-2">
              <Image source={icons.star} className="size-5" />
              <Text className="text-black-200 text-sm mt-1 font-rubik-medium">
                {shop?.shop_rating.toFixed(1)}
              </Text>
            </View>
          </View>

          <View className="flex flex-row items-center mt-5">
            <View className="flex flex-row items-center justify-center bg-primary-100 rounded-full size-14">
              <Image source={icons.cash} className="size-7" />
            </View>
            <Text className="text-black-300 text-lg font-rubik-medium ml-2">
              Cash 
            </Text>
            <View className="flex flex-row items-center justify-center bg-primary-100 rounded-full size-14 ml-7">
              <Image source={icons.online} className="size-7" />
            </View>
            <Text className="text-black-300 text-lg font-rubik-medium ml-2">
              Online payment
            </Text>
          </View>

          <View className="w-full border-t border-primary-200 pt-7 mt-5">
            <Text className="text-black-300 text-xl font-rubik-bold">
              Owner
            </Text>

            <View className="flex flex-row items-center justify-between mt-4">
              <View className="flex flex-row items-center">
                <Image
                  source={images.avatar}
                  className="size-14 rounded-full"
                />

                <View className="flex flex-col items-start justify-center ml-3">
                  <Text className="text-lg text-black-300 text-start font-rubik-bold">
                    Xerox wala bhaii
                  </Text>
                  <Text className="text-sm text-black-200 text-start font-rubik-medium">
                    xeroxwala@gmail.com
                  </Text>
                </View>
              </View>

              <View className="flex flex-row items-center gap-3">
                <Image source={icons.chat} className="size-7" />
                <Image source={icons.phone} className="size-7" />
              </View>
            </View>
          </View>

          <View className="mt-7">
            <Text className="text-black-300 text-xl font-rubik-bold">
              Overview
            </Text>
            <Text className="text-black-200 text-base font-rubik mt-2">
              Xeroxxxx shop with number one facilities
            </Text>
          </View>

          <View className="mt-7">
            <Text className="text-black-300 text-xl font-rubik-bold">
              Facilities
            </Text>

            {shop?.shop_facilites && Object.keys(shop.shop_facilites).length > 0 && (
              <View className="flex flex-wrap items-start justify-start mt-2 gap-5">
                {Object.entries(shop.shop_facilites).map(([facility, value], index) => {
                  const facilityData = facilities.find((f) => f.title === facility);

                  return (
                    <View
                      key={index}
                      className="flex flex-row items-center space-x-3 bg-primary-100 px-3 py-2 rounded-lg"
                    >
                      <View className="size-10 bg-white rounded-full flex items-center justify-center">
                        <Image
                          source={facilityData ? facilityData.icon : icons.info}
                          className="size-6"
                          resizeMode="contain"
                        />
                      </View>
                      <Text className="text-black-300 text-sm font-rubik">
                        {facility} - ₹{value}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          {shop?.shop_images && shop.shop_images.length > 0 && (
            <View className="mt-7">
              <Text className="text-black-300 text-xl font-rubik-bold">
                Shop images
              </Text>
              <FlatList
                contentContainerStyle={{ paddingRight: 20 }}
                data={shop?.shop_images}
                keyExtractor={(_, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <Image
                    source={typeof item === 'string' ? { uri: item } : item} 
                    className="size-40 rounded-xl"
                    resizeMode="cover"
                  />
                )}
                contentContainerClassName="flex gap-4 mt-3"
              />
            </View>
          )}

          <View className="mt-5">
            <Text className="text-black-300 text-xl font-rubik-bold mb-4">
              View on map
            </Text>
            <TouchableOpacity onPress={openGoogleMaps} activeOpacity={0.8}>
              <View className="h-48 w-full overflow-hidden rounded-xl border border-black-100">
              {latitude && longitude && (<MapView
                  provider={PROVIDER_GOOGLE}
                  style={{ height: '100%', width: '100%' }}
                  customMapStyle={mapStyle}
                  initialRegion={{
                    latitude: latitude ,
                    longitude: longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                >
                  
                    <Marker
                      coordinate={{
                        latitude: latitude,
                        longitude: longitude
                      }}
                      title={shop?.shop_name}
                      description={shop?.shop_address}
                    />
                </MapView>
              )}
              </View>
            </TouchableOpacity>
          </View>

          {/* {shop?.reviews.length > 0 && (
            <View className="mt-7">
              <View className="flex flex-row items-center justify-between">
                <View className="flex flex-row items-center">
                  <Image source={icons.star} className="size-6" />
                  <Text className="text-black-300 text-xl font-rubik-bold ml-2">
                    {shop?.shop_rating} 
                  </Text>
                </View>

                <TouchableOpacity>
                  <Text className="text-primary-300 text-base font-rubik-bold">
                    View All
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="mt-5">
                <Comment item={shop?.reviews[0]} />
              </View>
            </View>
          )} */}
        </View>
      </ScrollView>

      <View className="absolute bg-white bottom-0 w-full rounded-t-2xl border-t border-r border-l border-primary-200 p-7">
        <View className="flex flex-row items-center justify-between gap-10">
          {/* <View className="flex flex-col items-start">
            <Text className="text-black-200 text-xs font-rubik-medium">
              Price
            </Text>
            <Text
              numberOfLines={1}
              className="text-primary-300 text-start text-2xl font-rubik-bold"
            >
              {shop?.price} 500 
            </Text>
          </View> */}

          <TouchableOpacity className="flex-1 flex flex-row items-center justify-center bg-primary-300 py-3 rounded-full shadow-md shadow-zinc-400">
            <Text className="text-white text-lg text-center font-rubik-bold">
              Send documents
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Property;