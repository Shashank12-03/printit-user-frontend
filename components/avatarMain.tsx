import {View, Text} from 'react-native';

interface AvatarProps {
    name: string;
}

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase();
    };

const AvatarMain = ({ name }: AvatarProps) => {
    return (
        <View className="w-12 h-12 bg-primary-300 rounded-full flex items-center justify-center">
        <Text className="text-white font-rubik-medium text-3xl">
            {getInitials(name)}
        </Text>
        </View>
    );
};

export default AvatarMain;