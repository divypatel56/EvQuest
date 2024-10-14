import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';
import FavouriteScreen from '../Screens/FavouriteScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import SearchScreen from '../Screens/SearchScreen';

const Tab = createBottomTabNavigator();

const Navigator = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Search"
                component={SearchScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Icon name="search" type="font-awesome" color={color} />
                    ),
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Favourite"
                component={FavouriteScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Icon name="heart" type="font-awesome" color={color} />
                    ),
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Icon name="user" type="font-awesome" color={color} />
                    ),
                    headerShown: false,
                }}
            />
            
        </Tab.Navigator>
    );
};

export default Navigator;
