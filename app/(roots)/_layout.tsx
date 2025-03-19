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
  // const { loading, isLoggedIn } = useGlobalContext();
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
      console.log('ineffect');
      const fetchUser = async () => {
        const loggedUser = await getCurrentUserNormal();
        // console.log(loggedUser);
        setUser(loggedUser); 
        setIsLoggedIn(true);
        setLoading(false);
      }
      fetchUser();
  },[isLoggedIn]);
  // console.log('logged ', isLoggedIn);
  // console.log('user ', user);
  // console.log('loading ', loading);
  if (loading) {
    return (
      <SafeAreaView className="bg-white h-full flex justify-center items-center">
        <ActivityIndicator className="text-primary-300" size="large" />
      </SafeAreaView>
    );
  }

  if (!isLoggedIn) {
    return <Redirect href="/sign-in" />;
  }

  return <Slot />;
}