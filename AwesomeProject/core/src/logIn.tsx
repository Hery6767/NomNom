import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    ImageBackground,
    ActivityIndicator,
    Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../auth/AuthContext';

const BRAND = '#0d4d3b';

export default function LogIn() {
    const navigation = useNavigation<any>();
    const { signIn, loading } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Missing info', 'Please enter email and password');
            return;
        }

        try {
            await signIn(email.trim(), password);
            // ✅ replace để không quay lại Login
            navigation.replace('Home');
        } catch (err: any) {
            Alert.alert('Login failed', err?.message || 'Invalid email or password');
        }
    };

    return (
        <ImageBackground
            source={require('../image/onBoard_5.jpg')}
            style={{ flex: 1 }}
            resizeMode="cover"
        >
            <LinearGradient
                colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.15)', 'rgba(3,75,25,0.57)']}
                style={{ flex: 1 }}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        margin: 20,
                        backgroundColor: '#fff',
                        borderRadius: 30,
                        padding: 24,
                    }}
                >
                    <Text style={{ fontSize: 24, fontWeight: '700', color: '#0a3b2f' }}>
                        Welcome Back
                    </Text>
                    <Text style={{ color: '#666', marginBottom: 20 }}>
                        Your meal plan is ready when you are
                    </Text>

                    <Text>Email</Text>
                    <TextInput
                        placeholder="you@example.com"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        style={{
                            borderWidth: 1,
                            borderColor: '#ccc',
                            borderRadius: 10,
                            padding: 10,
                            marginBottom: 14,
                        }}
                    />

                    <Text>Password</Text>
                    <TextInput
                        placeholder="••••••••"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        style={{
                            borderWidth: 1,
                            borderColor: '#ccc',
                            borderRadius: 10,
                            padding: 10,
                            marginBottom: 20,
                        }}
                    />

                    <Pressable
                        onPress={handleLogin}
                        disabled={loading}
                        style={{
                            backgroundColor: BRAND,
                            paddingVertical: 14,
                            borderRadius: 14,
                            alignItems: 'center',
                            opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={{ color: '#fff', fontWeight: '700' }}>
                                Login
                            </Text>
                        )}
                    </Pressable>
                </View>
            </LinearGradient>
        </ImageBackground>
    );
}
