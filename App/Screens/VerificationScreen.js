// VerificationScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSignUp, useAuth } from '@clerk/clerk-expo'; // Import useAuth to clear session

const VerificationScreen = () => {
    const [code, setCode] = useState('');
    const { isLoaded, signUp } = useSignUp();
    const { signOut } = useAuth(); // Destructure signOut to end session
    const navigation = useNavigation();

    const handleVerify = async () => {
        if (!isLoaded) return;

        try {
            await signUp.attemptEmailAddressVerification({ code });
            Alert.alert('Success', 'Email verified successfully!');

            // Explicitly sign out or clear any existing session
            await signOut(); // Ends any active session after verification

            // Navigate to Login screen
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Verification error', error.errors[0]?.message || 'Unknown error');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Verify Your Email</Text>
            <Text style={styles.subtitle}>Enter the code sent to your email to complete verification.</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Verification Code"
                placeholderTextColor="#888"
                onChangeText={(text) => setCode(text)}
                keyboardType="number-pad"
            />
            <TouchableOpacity style={styles.button} onPress={handleVerify}>
                <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 22,
        fontFamily: 'Outfit-medium',
        color: '#333',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Outfit',
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 15,
    },
    input: {
        width: '100%',
        maxWidth: 350,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 16,
        fontFamily: 'Outfit',
        marginBottom: 15,
        backgroundColor: '#F9F9F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    button: {
        backgroundColor: '#6a46ab',
        borderRadius: 25,
        paddingVertical: 15,
        paddingHorizontal: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontFamily: 'Outfit-medium',
    },
});

export default VerificationScreen;
