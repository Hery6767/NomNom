// navigations/Tabs.tsx
import React from 'react';
import { View, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
// screens
import Home from '../src/home';
import Meals from '../src/meals';
import List from '../src/list';
import Recipes from '../src/recipes';
import Profile from '../src/profile';
import { COLORS } from '../style/colors';

const { BRAND, BRAND_LIGHT } = COLORS;


export type BottomTabParamList = {
    Home: undefined;
    Meals: undefined;
    List: undefined;
    Recipes: undefined;
    Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function Tabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarLabelStyle: { fontSize: 11, fontWeight: '700', marginBottom: 6 },
                tabBarActiveTintColor: BRAND,
                tabBarInactiveTintColor: 'rgba(0,0,0,0.55)',
                tabBarStyle: {
                    position: 'absolute',
                    height: 74,
                    borderTopWidth: 0,
                    backgroundColor: BRAND_LIGHT,     // nền xanh nhạt
                    marginHorizontal: 12,
                    marginBottom: 10,
                    borderRadius: 22,
                    paddingTop: 8,
                    elevation: 10,
                    shadowColor: '#000',
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 6 },
                },
                tabBarIcon: ({ focused, color, size }) => {
                    // icon theo từng route
                    const map: Record<string, React.ReactNode> = {
                        Home: <Image
                            source={require('../assets/icon/home.png')}
                            style={{ width: 20, height: 20, tintColor: focused ? '#fff' : BRAND }}
                        />,
                        Meals: <Image
                            source={require('../assets/icon/Cal.png')}
                            style={{ width: 20, height: 20, tintColor: focused ? '#fff' : BRAND }}
                        />,
                        List: <Image
                            source={require('../assets/icon/list-check.png')}
                            style={{ width: 20, height: 20, tintColor: focused ? '#fff' : BRAND }}
                        />,
                        Recipes: <Image
                            source={require('../assets/icon/hatcook.png')}
                            style={{ width: 20, height: 20, tintColor: focused ? '#fff' : BRAND }}
                        />,
                        Profile: <Image
                            source={require('../assets/icon/user.png')}
                            style={{ width: 20, height: 20, tintColor: focused ? '#fff' : BRAND }}
                        />,
                    };

                    // viên thuốc khi active
                    return (
                        <View
                            style={{
                                width: 44,
                                height: 44,
                                borderRadius: 22,
                                backgroundColor: focused ? BRAND : 'transparent',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: -6, // nhô icon lên chút cho giống mockup
                            }}
                        >
                            {map[route.name] ?? <Ionicons name="ellipse" size={20} color={color} />}
                        </View>
                    );
                },
            })}
        >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Meals" component={Meals} />
            <Tab.Screen name="List" component={List} />
            <Tab.Screen name="Recipes" component={Recipes} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    );
}
