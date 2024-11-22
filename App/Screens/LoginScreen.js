//LoginScreen.js
// -------------------------- Imports --------------------------
// Core components and libraries
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Image, Alert } from 'react-native';
// Import useNavigation
import { useNavigation } from '@react-navigation/native';
//Auth imports
import { useSignIn } from '@clerk/clerk-expo';

import * as Updates from 'expo-updates';
//Icon Library
import { Ionicons } from '@expo/vector-icons';

// -------------------------- Component --------------------------

/**
 * LogIn Screen Component
 * Displays the Login screen with Random facts, navigation, and Log-In functionality.
 */
export default function LoginScreen({ setIsSignedIn }) {
    // Clerk hooks for managing sign-in
    const { isLoaded, signIn } = useSignIn();

    //State Managment
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const navigation = useNavigation();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [randomFact, setRandomFact] = useState('');

    // Initial opacity for fade-in animation
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Fun facts array for displaying EV-related trivia
    const funFacts = [
        "EVs produce zero tailpipe emissions, helping reduce pollution in cities!",
        "Electric vehicles can convert over 77% of electrical energy from the grid to power at the wheels.",
        "EVs are much quieter than traditional vehicles, reducing noise pollution.",
        "Electric vehicles require less maintenance due to fewer moving parts!",
        "Some electric cars can go from 0 to 60 mph in under 3 seconds!"
    ];

    // Select a random fun fact on component mount
    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * funFacts.length);
        setRandomFact(funFacts[randomIndex]);
    }, []);

    // Fade-in animation for the logo
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1, // Opacity goes to 1 (fully visible)
            duration: 2000, // Animation duration in milliseconds
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    //  -------------------------- Handlers --------------------------

    // Email validation function
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    //Function to handle Log-in
    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Invalid Input", "Please fill in both fields.");
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert("Invalid Email", "Please enter a valid email address.");
            return;
        }

        if (!isLoaded) return; // Prevent actions if Clerk is not loaded

        try {
            const signInAttempt = await signIn.create({ identifier: email, password });

            if (signInAttempt.status === 'complete') {
                console.log('Login successful, navigating to Tabs');
                Updates.reloadAsync();
            } else if (signInAttempt.status === 'needs_first_factor') {
                setErrorMessage('Please complete the login verification.');
            } else if (signInAttempt.status === 'needs_second_factor') {
                setErrorMessage('Two-factor authentication required.');
            }
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert("Login Failed", error.errors?.[0]?.message || 'An unknown error occurred during login.');

        }
    };

    // -------------------------- UI Rendering --------------------------
    return (
        <View style={styles.container}>
            {/* Display a fun fact */}
            <Text style={styles.funFact}>Do you know?</Text>
            <Text style={styles.subtitle}>{randomFact}</Text>

            {/* Logo with fade-in animation */}
            <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
                <Image source={require('./../../assets/Images/loginBG.jpg')} style={styles.logo} />
            </Animated.View>

            {/* Login form card */}
            <View style={styles.card}>
                <Text style={styles.header}>Login</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    onChangeText={(text) => setEmail(text.trim())}
                    value={email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                {/* Password input field with visibility toggle */}
                <View style={styles.passwordInputContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Password"
                        secureTextEntry={!isPasswordVisible}
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                    />
                    <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
                        <Ionicons name={isPasswordVisible ? "eye" : "eye-off"} size={24} color="gray" />
                    </TouchableOpacity>
                </View>

                {/* Login button */}
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Log In</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}


// -------------------------- Styles --------------------------

/**
 * Styles for the Log-in Screen component
 */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    funFact: {
        fontSize: 22,
        fontFamily: 'Outfit-medium',
        color: '#333',
        textAlign: 'center',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Outfit',
        color: '#555',
        textAlign: 'center',
    },
    logoContainer: {
        marginBottom: 40,
    },
    logo: {
        width: 320,
        height: 180,
        marginTop: 15,
        resizeMode: 'cover',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 25,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        width: '100%',
        maxWidth: 350,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 6,
    },
    header: {
        fontSize: 22,
        fontFamily: 'Outfit-medium',
        color: '#333',
        textAlign: 'center',
        marginBottom: 8,
    },
    input: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
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
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#F9F9F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
        marginBottom: 15,
        paddingRight: 10,
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        fontFamily: 'Outfit',
    },
    eyeIcon: {
        padding: 10,
    },
    button: {
        backgroundColor: '#6a46ab',
        borderRadius: 25,
        paddingVertical: 15,
        alignItems: 'center',
        marginBottom: 15,
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
    forgotPasswordButton: {
        alignItems: 'center',
        marginTop: 10,
    },
    forgotPasswordText: {
        color: '#6f7070',
        fontFamily: 'Outfit',
        fontSize: 16,
    },
});
