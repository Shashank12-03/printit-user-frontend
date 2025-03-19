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

const Avatar = ({ name }: AvatarProps) => {
    return (
        <View className="w-24 h-24 bg-primary-300 rounded-full flex items-center justify-center">
        <Text className="text-white font-rubik-medium text-3xl">
            {getInitials(name)}
        </Text>
        </View>
    );
};

export default Avatar;