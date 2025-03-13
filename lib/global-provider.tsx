// import React, { createContext, useContext, ReactNode } from "react";
// import { getCurrentUserNormal, getShops } from "@/apis/userApis";
// import { useAppwrite } from "./useAppwrite";
// import { useLocation } from "./use-location";
// import * as Location from "expo-location";
// import { getUser } from "./auth";

// interface GlobalContextType {
//   isLogged: boolean;
//   user: User | null;
//   loading: boolean;
//   refetch: (newParams: Record<string, string | number>) => Promise<void>;
//   location: Location.LocationObject | null;
// }

// // interface Shops {
// //   $id: string;
// //   shopName: string;
// //   shopEmail: string;
// //   shopPictures: string[];
// //   shopAddress: string;
// //   shopLocation:{
// //     "latitude":
// //   }
// // }

// interface User {
//   $id: string;
//   name: string;
//   email: string;
//   picture: string;
// }

// const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// interface GlobalProviderProps {
//   children: ReactNode;
// }

// export const GlobalProvider = ({ children }: GlobalProviderProps) => {
//   const {
//     data: user,
//     loading:userLoading,
//     refetch,
//   } = useAppwrite({
//     fn: getUser,
//   });

//   const {
//     location,
//     loading: locationLoading,
//   } = useLocation();


//   const isLogged = !!user;
//   const loading = userLoading;

//   const contextValue = {
//     isLogged,
//     user,
//     loading,
//     refetch,
//     location,
//   };

//   return (
//     <GlobalContext.Provider value={contextValue}>
//       {children}
//     </GlobalContext.Provider>
//   );
// };

// export const useGlobalContext = (): GlobalContextType => {
//   const context = useContext(GlobalContext);
//   if (!context) {
//     throw new Error("useGlobalContext must be used within a GlobalProvider");
//   }
//   return context;
// };

// export default GlobalProvider;