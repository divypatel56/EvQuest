import { View, Text, Image, StyleSheet, TouchableOpacity, Animated, Linking } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import * as WebBrowser from "expo-web-browser";
import { useWarmUpBrowser } from '../../hooks/warmUpBrowser';
import { useOAuth } from '@clerk/clerk-expo';


WebBrowser.maybeCompleteAuthSession();

export default function AppStartScreen() {
    useWarmUpBrowser;
    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

    const navigation = useNavigation(); // Access navigation
    const titleAnim = useRef(new Animated.Value(0)).current;
    const textAnim = useRef(new Animated.Value(0)).current;
    const buttonAnim = useRef(new Animated.Value(0)).current;
    const imageAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(titleAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(textAnim, {
                toValue: 1,
                duration: 1000,
                delay: 200,
                useNativeDriver: true,
            }),
            Animated.timing(buttonAnim, {
                toValue: 1,
                duration: 1000,
                delay: 400,
                useNativeDriver: true,
            }),
            Animated.timing(imageAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start();
    }, [titleAnim, textAnim, buttonAnim, imageAnim]);

    const titleOpacity = titleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const textOpacity = textAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const buttonOpacity = buttonAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const imageScale = imageAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.5, 1], // Scales the image from 50% to 100%
    });
    // Function to handle Google Sign-In
    const handleGoogleSignIn = async () => {
        try {
            const { createdSessionId, signIn, signUp, setActive } =
                await startOAuthFlow();
            if (createdSessionId) {
                setActive({ session: createdSessionId });
                console.log('Signed in successfully');
            } else {
                console.log('Session created but no further action taken');
            }
        } catch (err) {
            console.error('OAuth error', err);
        }
    };

    return (
        <View style={styles.container}>
            <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
                Join the quest community!
            </Animated.Text>

            <Animated.Image
                source={require('./../../assets/Images/EVbg.webp')}
                style={[styles.bgImage, { transform: [{ scale: imageScale }] }]}
            />

            <Animated.View style={[styles.textContainer, { opacity: textOpacity }]}>
                <Text style={styles.subHeading}>Public charging made easy.</Text>
                <Text style={styles.subtitle}>Locate the thousands of charging station on one click!</Text>
            </Animated.View>

            <Animated.View style={[styles.buttonContainer, { opacity: buttonOpacity }]}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('SignUp')}
                >
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Login')} // Navigate to Login screen
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
                <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    bgImage: {
        width: '70%',
        height: 170,
        resizeMode: 'cover',
        marginBottom: 20,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 25,
    },
    textContainer: {
        marginBottom: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontFamily: 'Outfit-medium',
        color: '#333',
        textAlign: 'center',
        marginBottom: 5,
    },
    subHeading: {
        fontSize: 24,
        fontFamily: 'Outfit-medium',
        color: '#333',
        textAlign: 'center',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 18,
        fontFamily: 'Outfit',
        color: '#555',
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#6a46ab',
        borderRadius: 25,
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: 15,
        width: '80%',
        height: 55
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontFamily: 'Outfit-medium',
    },
    googleButton: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 30,
        alignItems: 'center',
        width: '80%',
    },
    googleButtonText: {
        color: '#333',
        fontSize: 16,
        fontFamily: 'Outfit',
    },
});