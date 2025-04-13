import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { addUserDetails } from "@/apis/userApis";

const Onboarding = () => {
  const { isEdit } = useLocalSearchParams<{ isEdit?: string }>();
  const [user, setUser] = useState<{ name: string; profile_photo: string | null; mobile_no: string }>({
    name: "",
    profile_photo: "", 
    mobile_no: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser && isEdit) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };
    fetchUser();
  }, [isEdit]);

  const handleSave = async () => {
    if (!user.name || !user.mobile_no) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const setUserResponse = await addUserDetails({
        name: user.name,
        profile_photo: user.profile_photo, // Placeholder for now
        mobile_no: user.mobile_no,
      });

      if (!setUserResponse) {
        Alert.alert("Error", "Failed to save user data.");
        return;
      }

      // Save user data locally
      await AsyncStorage.setItem("user", JSON.stringify(user));
      Alert.alert("Success", isEdit ? "Profile updated!" : "Welcome!");
      router.push("/(roots)/(tabs)/profile"); // Navigate back to the profile page
    } catch (error) {
      console.error("Error saving user data:", error);
      Alert.alert("Error", "Failed to save user data.");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white px-5 py-10">
      <Text className="text-2xl font-rubik-bold text-center mb-5">
        {isEdit ? "Edit Profile" : "Welcome!"}
      </Text>
      <TouchableOpacity
        className="w-32 h-32 bg-gray-200 rounded-full self-center justify-center items-center mb-5"
      >
        {user.profile_photo ? (
          <Image source={{ uri: user.profile_photo }} className="w-full h-full rounded-full" />
        ) : (
          <Text className="text-gray-500">No Image</Text>
        )}
      </TouchableOpacity>
      <TextInput
        placeholder="Name"
        value={user.name}
        onChangeText={(text) => setUser((prev) => ({ ...prev, name: text }))}
        className="w-full bg-gray-100 rounded-lg p-4 mb-4"
      />
      <TextInput
        placeholder="Phone Number"
        value={user.mobile_no}
        onChangeText={(text) => setUser((prev) => ({ ...prev, mobile_no: text }))}
        keyboardType="phone-pad"
        className="w-full bg-gray-100 rounded-lg p-4 mb-4"
      />
      <TouchableOpacity
        onPress={handleSave}
        className="w-full bg-primary-300 rounded-lg p-4"
      >
        <Text className="text-white text-center text-lg font-rubik-bold">
          {isEdit ? "Save Changes" : "Get Started"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Onboarding;