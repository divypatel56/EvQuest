import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React from 'react';

export default function SignUpScreen() {
    return (
        <View style={styles.container}>
            <Image source={require('./../../assets/Images/EV-Header.jpg')} style={styles.logoImage} />
            <Image source={require('./../../assets/Images/EVbg.webp')} style={styles.bgImage} />

            <View style={styles.textContainer}>
                <Text style={styles.title}>Create Your EV-Quest Account</Text>
                <Text style={styles.subtitle}>Sign up and start your journey!</Text>
            </View>

            <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#888" />
                <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" placeholderTextColor="#888" />
                <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} placeholderTextColor="#888" />
                <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry={true} placeholderTextColor="#888" />

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.signInButton}>
                    <Text style={styles.signInText}>Already have an account? Sign In</Text>
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
    logoImage: {
        width: '80%',
        height: 50,
        resizeMode: 'contain',
        marginBottom: 30,
    },
    bgImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        marginBottom: 20,
    },
    textContainer: {
        marginBottom: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
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
    inputContainer: {
        width: '100%',
        paddingHorizontal: 20,
    },
    input: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 16,
        fontFamily: 'Outfit',
        marginBottom: 15,
        backgroundColor: '#FFF',
    },
    button: {
        backgroundColor: '#28A745', // Bootstrap-like green color for sign-up
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontFamily: 'Outfit-medium',
    },
    signInButton: {
        alignItems: 'center',
    },
    signInText: {
        color: '#007BFF',
        fontFamily: 'Outfit',
        fontSize: 16,
    },
});
