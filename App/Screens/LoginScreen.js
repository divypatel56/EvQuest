import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Image } from 'react-native';

export default function LoginScreen() {
    // Array of EV fun facts
    const funFacts = [
        "EVs produce zero tailpipe emissions, helping reduce pollution in cities!",
        "Electric vehicles can convert over 77% of electrical energy from the grid to power at the wheels.",
        "EVs are much quieter than traditional vehicles, reducing noise pollution.",
        "Electric vehicles require less maintenance due to fewer moving parts!",
        "Some electric cars can go from 0 to 60 mph in under 3 seconds!"
    ];
    // Select a random fun fact when the app loads
    const [randomFact, setRandomFact] = useState('');

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * funFacts.length);
        setRandomFact(funFacts[randomIndex]);
    }, []);

    const fadeAnim = useRef(new Animated.Value(0)).current;  // Initial opacity set to 0

    // Fade-in animation for the logo
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1, // Opacity goes to 1 (fully visible)
            duration: 2000, // Animation duration in milliseconds
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    return (
        <View style={styles.container}>
            {/* Fun Fact Section */}
            <Text style={styles.funFact}>Do you know?</Text>
            <Text style={styles.subtitle}>{randomFact}</Text>
            {/* Logo with fade-in animation */}
            <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
                <Image source={require('./../../assets/Images/loginBG.jpg')} style={styles.logo} />
            </Animated.View>

            {/* Login Form */}
            <View style={styles.card}>
                <Text style={styles.header}>Login</Text>

                <TextInput style={styles.input} placeholder="Username" />
                <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} />

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Log In</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.forgotPasswordButton}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
            </View>
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
        marginBottom: 40, // Space between logo and login form
    },
    logo: {
        width: 320,  // Adjust the logo size as necessary
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
        maxWidth: 350, // Keep the form responsive
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 6, // Shadow for Android
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
    }
});
