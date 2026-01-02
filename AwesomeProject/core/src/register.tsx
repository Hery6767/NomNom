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

export default function Register() {
    const navigation = useNavigation<any>();
    const { signUp, loading } = useAuth();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');

    const handleRegister = async () => {
        console.log('REGISTER pressed', { fullName, email });
        if (!email || !password) {
            Alert.alert('Missing info', 'Please enter email and password');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Weak password', 'Password must be at least 6 characters');
            return;
        }
        if (password !== confirm) {
            Alert.alert('Mismatch', 'Passwords do not match');
            return;
        }

        try {
            await signUp(fullName.trim(), email.trim(), password);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });


        } catch (err: any) {
            console.log('REGISTER ERROR:', err);
            Alert.alert('Register failed', err?.message || 'Cannot create account');
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
                        Create Account
                    </Text>
                    <Text style={{ color: '#666', marginBottom: 20 }}>
                        Let’s set up your NomNom profile
                    </Text>

                    <Text>Full name</Text>
                    <TextInput
                        placeholder="Your name"
                        value={fullName}
                        onChangeText={setFullName}
                        style={{
                            borderWidth: 1,
                            borderColor: '#ccc',
                            borderRadius: 10,
                            padding: 10,
                            marginBottom: 12,
                        }}
                    />

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
                            marginBottom: 12,
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
                            marginBottom: 12,
                        }}
                    />

                    <Text>Confirm password</Text>
                    <TextInput
                        placeholder="••••••••"
                        secureTextEntry
                        value={confirm}
                        onChangeText={setConfirm}
                        style={{
                            borderWidth: 1,
                            borderColor: '#ccc',
                            borderRadius: 10,
                            padding: 10,
                            marginBottom: 16,
                        }}
                    />

                    <Pressable
                        onPress={handleRegister}
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
                                Create account
                            </Text>
                        )}
                    </Pressable>

                    <Pressable
                        onPress={() => navigation.goBack()}
                        style={{ marginTop: 16, alignItems: 'center' }}
                    >
                        <Text style={{ color: '#0a3b2f' }}>
                            Already have an account? Log in
                        </Text>
                    </Pressable>
                </View>
            </LinearGradient>
        </ImageBackground>
    );
}
