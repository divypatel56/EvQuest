// SignUpScreen.js
// -------------------------- Imports --------------------------
// Core components and libraries
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSignUp } from '@clerk/clerk-expo';

// -------------------------- Component --------------------------

/**
 * SignUp Screen Component
 * Displays a form to create a new user account with Clerk's sign-up service.
 */
const SignUpScreen = () => {

    // -------------------------- State Management --------------------------
    const [fullName, setFullName] = useState(''); //User's full name
    const [email, setEmail] = useState(''); //user's email
    const [password, setPassword] = useState('');// password
    const [confirmPassword, setConfirmPassword] = useState(''); // confirm password 
    const [errorMessage, setErrorMessage] = useState(null); // Error message for validation feedback

    const { isLoaded, signUp } = useSignUp(); // Clerk's sign-up hooks
    const navigation = useNavigation(); // Navigation hook for routing

    // -------------------------- Helper Functions --------------------------
    /**
    * Validates the email format.
    */
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    //---------------------------- Handlers -------------------------------

    /**
     * Handles the sign-up process by validating inputs and interacting with Clerk's API.
     */
    const handleSignUp = async () => {
        if (!isLoaded) {
            console.log("Sign up not loaded yet");
            return;
        }

        // Check for empty fields
        if (!fullName || !email || !password || !confirmPassword) {
            setErrorMessage("All fields are required.");
            console.log("Missing fields");
            return;
        }

        if (!validateEmail(email)) {
            setErrorMessage("Please enter a valid email address.");
            console.log("Invalid email format");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            console.log("Passwords do not match");
            return;
        }
        //Attempt Sign up Process
        try {
            console.log("Attempting sign-up...");
            await signUp.create({ emailAddress: email, password });
            await signUp.prepareEmailAddressVerification();
            console.log("Email verification link sent!");
            navigation.navigate('Verification');
        } catch (error) {
            const errorMsg = error.errors[0]?.message || 'Unknown error';
            setErrorMessage('Sign-up error: ' + errorMsg);
            console.log("Sign-up error:", errorMsg);
        }
    };

    // -------------------------- UI Rendering --------------------------

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Create Your Account</Text>
                <Text style={styles.subtitle}>Sign up and start your journey!</Text>
            </View>

            <Image source={require('./../../assets/Images/signupBG.webp')} style={styles.logo} />

            <View style={styles.card}>
                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#888"
                    onChangeText={(text) => setFullName(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    placeholderTextColor="#888"
                    onChangeText={(text) => setEmail(text.trim())}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry={true}
                    placeholderTextColor="#888"
                    onChangeText={(text) => setPassword(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    secureTextEntry={true}
                    placeholderTextColor="#888"
                    onChangeText={(text) => setConfirmPassword(text)}
                />

                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.signInButton}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.signInText}>Already have an account? Sign In</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// -------------------------- Styles --------------------------

/**
 * Styles for the Sign-up Screen component
 */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    textContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontFamily: 'Outfit-medium',
        color: '#333',
        textAlign: 'center',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Outfit',
        color: '#666',
        textAlign: 'center',
    },
    logo: {
        width: '90%',
        height: 190,
        resizeMode: 'cover',
        marginBottom: 20,
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
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 6,
    },
    input: {
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
    signInButton: {
        alignItems: 'center',
        marginTop: 10,
    },
    signInText: {
        color: '#6f7070',
        fontFamily: 'Outfit',
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        fontFamily: 'Outfit',
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default SignUpScreen;
