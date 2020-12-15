import * as React from 'react';
import { TouchableOpacity, Text } from 'react-native';

export const CustomButton = ({ title, onPress, style }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={{ justifyContent: 'center', alignItems: 'center', ...style }}
  >
    <Text>{title}</Text>
  </TouchableOpacity>
);