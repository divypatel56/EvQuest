import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

const SignUpScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Create Your Account</Text>
                <Text style={styles.subtitle}>Sign up and start your journey!</Text>
            </View>

            <Image source={require('./../../assets/Images/signupBG.webp')} style={styles.logo} />

            <View style={styles.card}>
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
};

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
        maxWidth: 350, // Maximum width for larger screens
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 6, // Shadow for Android
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
});

export default SignUpScreen;
