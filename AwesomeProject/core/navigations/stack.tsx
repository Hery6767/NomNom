// navigations/Stack.tsx
import React from 'react';
import {
    createStackNavigator,
    CardStyleInterpolators,
} from '@react-navigation/stack';

import { useAuth } from '../auth/AuthContext';

import OnBoard from '../src/onBoard';
import LogIn from '../src/logIn';
import Register from '../src/register';
import Tabs from './tab';
import SocketTest from '../src/SocketTest';
import RecipeDetailScreen from '../src/recipe-detail';
import RecipeCreateScreen from '../src/recipe-create';

export type RootStackParamList = {
    OnBoard: undefined;
    LogIn: undefined;
    Register: undefined;
    Home: undefined;   // Home = Tabs
    SocketTest: undefined;
    RecipeCreate: undefined;
    RecipeDetail: { id: number };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function MainStack() {
    const { user, restoring } = useAuth();

    // 👉 Chờ restore AsyncStorage xong mới render
    if (restoring) {
        return null; // hoặc splash screen
    }

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                transitionSpec: {
                    open: { animation: 'timing', config: { duration: 600 } },
                    close: { animation: 'timing', config: { duration: 300 } },
                },
                cardStyleInterpolator:
                    CardStyleInterpolators.forFadeFromBottomAndroid,
            }}
        >
            {user ? (
                // =========================
                // ✅ ĐÃ LOGIN
                // =========================
                <>
                    <Stack.Screen name="Home" component={Tabs} />
                    <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
                    <Stack.Screen name="RecipeCreate" component={RecipeCreateScreen} />
                    <Stack.Screen name="SocketTest" component={SocketTest} />
                </>
            ) : (
                // =========================
                // ❌ CHƯA LOGIN
                // =========================
                <>
                    <Stack.Screen name="OnBoard" component={OnBoard} />
                    <Stack.Screen name="LogIn" component={LogIn} />
                    <Stack.Screen name="Register" component={Register} />
                </>
            )}
        </Stack.Navigator>
    );
}
