import { Redirect, Slot } from "expo-router";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect,useState } from "react";
import { getUser } from "@/lib/auth";
import { getCurrentUserNormal } from "@/apis/userApis";

// import { useGlobalContext } from "@/lib/global-provider";

interface User {
  $id: string;
  name: string;
  email: string;
  picture: string;
}


export default function AppLayout() {
  const [authState, setAuthState] = useState({
    user: null,
    isLoggedIn: false,
    loading: true,
  });

  useEffect(() => {
    const fetchUser = async () => {
      const loggedUser = await getCurrentUserNormal();
      setAuthState({
        user: loggedUser,
        isLoggedIn: !!loggedUser,
        loading: false,
      });
    };

    if (authState.loading) {
      fetchUser();
    }
  }, [authState.loading]);

  if (!authState.isLoggedIn && !authState.loading) {
    return <Redirect href="/sign-in" />;
  }

  if (authState.loading) {
    return (
      <SafeAreaView className="bg-white h-full flex justify-center items-center">
        <ActivityIndicator className="text-primary-300" size="large" />
      </SafeAreaView>
    );
  }

  return <Slot />;
}