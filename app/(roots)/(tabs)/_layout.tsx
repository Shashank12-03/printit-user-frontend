import { View, Text, Image } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import icons from '@/constants/icons';
import { ImageSourcePropType } from 'react-native';

const TabIcon = ({ focused, icon, title }: { focused: boolean; icon: ImageSourcePropType; title: string }) => {
  return (
    <View style={{ flex: 1, marginTop: 3, alignItems: 'center' }}>
      <Image source={icon} style={{ tintColor: focused ? '#531A08' : '#666876', resizeMode: 'contain', width: 24, height: 24 }} />
      <Text style={{ color: focused ? '#531A08' : '#666876', fontSize: 12, marginTop: 1, textAlign: 'center' }}>{title}</Text>
    </View>
  );
};

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: 'white',
          position: 'absolute',
          borderColor: '#0061FF1A',
          borderTopWidth: 1,
          minHeight: 45,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={icons.home} title="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={icons.search} title="Search" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={icons.person} title="Profile" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;