import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';
import FavouriteScreen from '../Screens/FavouriteScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import SearchScreen from '../Screens/SearchScreen';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
    return (
        <Tab.Navigator
            initialRouteName="Search"
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: '#1e1e1e', // Dark background color
                    borderTopWidth: 0, // Removes the top border for a cleaner look
                    height: 60, // Increases height for better touch targets
                    paddingBottom: 8,
                },
                tabBarActiveTintColor: '#6a46ab', // Accent color for active tab icon
                tabBarInactiveTintColor: '#888888', // Muted color for inactive tab icons
                tabBarShowLabel: false, // Hide labels for a minimalist look
            }}
        >
            <Tab.Screen
                name="Search"
                component={SearchScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="search" type="font-awesome" color={color} size={24} />
                    ),
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Favourite"
                component={FavouriteScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="heart" type="font-awesome" color={color} size={24} />
                    ),
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="user" type="font-awesome" color={color} size={24} />
                    ),
                    headerShown: false,
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigation;
