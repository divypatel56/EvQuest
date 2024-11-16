import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, StyleSheet, Dimensions, Animated, Easing, TouchableOpacity, Alert, ScrollView
} from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProfileScreen() {
    const { signOut } = useAuth();
    const navigation = useNavigation();
    const { user } = useUser();

    const [floatAnim] = useState(new Animated.Value(0)); // Animation value for floating effect
    const [vehicleInfo, setVehicleInfo] = useState({
        chargingPoint: '',
        company: '',
    });

    useEffect(() => {
        // Start floating animation on mount
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: -10,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut();
            navigation.navigate('AppStart');
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    const handleVehicleChange = (key, value) => {
        setVehicleInfo({ ...vehicleInfo, [key]: value });
    };

    const handleSaveVehicleDetails = () => {
        // Display saved message
        Alert.alert('Vehicle Details Saved', 'Your vehicle details have been saved.');

        // After saving, the vehicleInfo state is already set with the updated data,
        // so it will persist in the input fields automatically
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
                <FontAwesome5 name="sign-out-alt" size={24} color="#ff5a5f" />
            </TouchableOpacity>

            <Animated.View style={[styles.floatingCard, { transform: [{ translateY: floatAnim }] }]}>
                <Text style={styles.header}>Profile</Text>
                <View style={styles.profileInfo}>
                    <Text style={styles.label}>Username</Text>
                    <TextInput style={styles.input} value={user?.primaryEmailAddress?.emailAddress} editable={false} />
                    <Text style={styles.label}>Password</Text>
                    <TextInput style={styles.input} value="********" secureTextEntry editable={false} />
                </View>
            </Animated.View>

            <Animated.View style={[styles.floatingCard, { transform: [{ translateY: floatAnim }] }]}>
                <Text style={styles.subHeader}>Vehicle Details</Text>
                <View style={styles.vehicleInfo}>
                    <Text style={styles.label}>Charging Point Type</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., CCS, CHAdeMO"
                        placeholderTextColor="#888"
                        value={vehicleInfo.chargingPoint}
                        onChangeText={(text) => handleVehicleChange('chargingPoint', text)}
                    />
                    <Text style={styles.label}>Company</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., Tesla"
                        placeholderTextColor="#888"
                        value={vehicleInfo.company}
                        onChangeText={(text) => handleVehicleChange('company', text)}
                    />
                </View>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveVehicleDetails}>
                    <Text style={styles.saveButtonText}>Save Vehicle Details</Text>
                </TouchableOpacity>
            </Animated.View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
        padding: 20,
    },
    logoutButton: {
        alignSelf: 'flex-end',
        marginTop: 40,
        marginRight: 20,
    },
    floatingCard: {
        width: SCREEN_WIDTH * 0.9,
        backgroundColor: '#2b2b2b',
        borderRadius: 15,
        padding: 20,
        marginVertical: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 10, // For Android shadow
    },
    header: {
        fontSize: 28,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    profileInfo: {
        marginBottom: 30,
    },
    label: {
        fontSize: 16,
        color: '#aaa',
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#333',
        color: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
    },
    subHeader: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    vehicleInfo: {
        marginBottom: 20,
    },
    saveButton: {
        backgroundColor: '#6a46ab',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 4,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontFamily: 'Outfit-medium',
    },
});

