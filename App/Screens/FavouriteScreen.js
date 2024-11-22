// FavouriteScreen.js
// -------------------------- Imports -------------------------
// Core React and React Native components
import { View, Text, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';

//Firebase import
import { collection, query, where, getDocs, onSnapshot, getFirestore } from "firebase/firestore";
import { app } from '../../assets/utils/FirebaseConfig';

//import { getFirestore } from "firebase/firestore";

//Screen and context
import { useUser } from '@clerk/clerk-expo';
import PlaceItem from './SearchPage/PlaceItem';

// -------------------------- FavouriteScreen Component --------------------------

/**
 * FavouriteScreen is a functional component that displays a user's favorite places.
 * It fetches the favorite places from Firestore based on the logged-in user's email and displays them in a list. 
 */

export default function FavouriteScreen() {
    const db = getFirestore(app); // Initialize Firestore
    const { user } = useUser();   // Get the current user from Clerk

    // State to store the list of favorite places
    const [favList, setFavList] = useState([]);

    /**
     * getFav fetches the user's favorite places from Firestore and updates the state.
     */
    const getFav = () => {
        const q = query(collection(db, "ev-fav-place"), // Firestore collection for favorite places
            where("email", "==", user?.primaryEmailAddress?.emailAddress));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const favPlaces = [];
            querySnapshot.forEach((doc) => {
                favPlaces.push(doc.data());
            });
            setFavList(favPlaces); // Update the state with the fetched favorite places
        });
        return () => unsubscribe();
    };

    useEffect(() => {
        if (user) {
            const unsubscribe = getFav();
            return () => unsubscribe();
        }
    }, [user]);

    // -------------------------- UI Rendering --------------------------
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Your Favourite Places</Text>
            {favList.length === 0 ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size={'large'} />
                    <Text style={styles.loaderText}>Loading...</Text>
                </View>
            ) : (
                <FlatList
                    data={favList}
                    renderItem={({ item }) => <PlaceItem place={item.place} />}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </View>
    );
}

// -------------------------- Styles --------------------------
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F4F4F8',
    },
    header: {
        fontFamily: 'Outfit-medium',
        fontSize: 24,
        color: '#333',
        textAlign: 'center',
        marginVertical: 12,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderText: {
        fontFamily: 'Outfit',
        marginTop: 5,
    },
    listContent: {
        paddingBottom: 20,
        alignItems: 'center',
    },
});
