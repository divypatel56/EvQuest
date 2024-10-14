import { View, Text, Button } from 'react-native';
import React from 'react';
import { useAuth } from '@clerk/clerk-expo'; // Import useAuth to access auth methods
import { useNavigation } from '@react-navigation/native'; // Import useNavigation for navigation

export default function ProfileScreen() {
    const { signOut } = useAuth(); // Destructure signOut from useAuth
    const navigation = useNavigation(); // Get navigation prop

    const handleSignOut = async () => {
        try {
            await signOut(); // Call the signOut method
            navigation.navigate('AppStart'); // Navigate back to AppStartScreen
        } catch (error) {
            console.error('Sign out error:', error); // Handle errors
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text>Profile Screen</Text>
            <Button title="Sign Out" onPress={handleSignOut} />
        </View>
    );
}
