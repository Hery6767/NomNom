import React from 'react';
import {
  View,
  Text,
  Pressable,
  ImageBackground,
  StatusBar,
  Platform,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../navigations/stack';
import SocketTest from '../src/SocketTest';
// ✅ Định nghĩa kiểu cho navigation prop
type OnBoardScreenProp = StackNavigationProp<RootStackParamList, 'OnBoard'>;
const { width } = Dimensions.get('window');
const BTN_W = Math.min(width * 0.9, 420);

export default function OnBoard() {
  const navigation = useNavigation<OnBoardScreenProp>();
  return (
    <ImageBackground
      source={require('../image/onBoard.png')} // đổi ảnh nếu cần
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.35)', 'rgba(3, 75, 25, 0.55)']}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          {/* Logo + Title */}
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 24,
              gap: 12,
            }}
          >
            <Text
              style={{
                fontFamily: 'OleoScripSwashCaps-Bold',
                color: '#0d4d3b',
                fontSize: 42,
                fontWeight: '700',
                textShadowColor: 'rgba(0,0,0,0.35)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 4,
              }}
            >
              NomNom
            </Text>

            <Text
              style={{
                color: '#0d4d3b',
                opacity: 0.9,
                fontSize: 24,
                letterSpacing: 0.3,
              }}
            >
              Plan. Cook. Enjoy.
            </Text>
          </View>

          {/* Buttons */}
          <View
            style={{
              paddingHorizontal: 20,
              paddingBottom: 200,
              gap: 12,
            }}
          >
            {/* Login */}
            <Pressable
              onPress={() => navigation.navigate('LogIn')}
              style={({ pressed }) => [
                {
                  width: BTN_W,
                  alignSelf: 'center',
                  backgroundColor: '#0d4d3b',
                  paddingVertical: 14,
                  borderRadius: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pressed ? 0.85 : 1,
                  ...(Platform.OS === 'android'
                    ? { elevation: 4 }
                    : {
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 3 },
                      shadowOpacity: 0.25,
                      shadowRadius: 6,
                    }),
                },
              ]}
            >
              <Text
                style={{
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: 16,
                }}
              >
                Login
              </Text>
            </Pressable>

            {/* Create Account */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 20,
              }}>
              <View style={{ flex: 1, height: 1, backgroundColor: '#ccc' }} />
              <Text style={{ marginHorizontal: 10, color: '#666' }}>or</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: '#ccc' }} />
            </View>

            <Pressable onPress={() => navigation.navigate('Register')}>
              <Text style={{ textAlign: 'center', color: '#0a3b2f' }}>
                New here? <Text style={{ fontWeight: '700' }}>Create Account</Text>
              </Text>
            </Pressable>


            {/* Or / Guest */}
            <View style={{ alignItems: 'center', marginTop: 16 }}>
              {/* Dòng chứa "— or —" */}

              {/* Nút Guest */}
              <Pressable onPress={() => console.log('Continue as guest')}>
                <Text
                  style={{
                    color: '#fff',
                    opacity: 0.9,
                    textDecorationLine: 'underline',
                    fontSize: 15,
                  }}
                >
                  Continue as a Guest
                </Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground >
  );
}
