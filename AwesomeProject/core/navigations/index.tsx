// navigations/index.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainStack from './stack';

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer >
  );
}
