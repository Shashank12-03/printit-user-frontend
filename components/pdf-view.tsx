import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FileText } from 'lucide-react-native';

interface PDFPreviewProps {
  fileName: string;
  fileSize: string;
  onView?: () => void;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ fileName, fileSize, onView }) => {
  return (
    <TouchableOpacity 
      className="bg-primary-200 rounded-lg p-4 my-2 shadow-s flex-row items-center"
      onPress={onView}
      activeOpacity={0.7}
    >
      {/* PDF Icon */}
      <View className='flex-row justify-between items-center'>
        <View className="mr-3">
          <FileText color="#531A08" size={35} />
        </View>
        
        {/* File Info */}
        <View className="flex-1">
          <Text numberOfLines={1} className="flex text-primary-300 text-lg font-rubik-medium items-center justify-center">
            {fileName}
          </Text>
          <Text className="text-primary-300">
            PDF • {fileSize}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PDFPreview;