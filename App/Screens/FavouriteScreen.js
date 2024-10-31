// FavouriteScreen.js
import { View, Text, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { useUser } from '@clerk/clerk-expo';
import { getFirestore } from "firebase/firestore";
import { app } from '../../assets/utils/FirebaseConfig';
import React, { useEffect, useState } from 'react';
import PlaceItem from './SearchPage/PlaceItem';

export default function FavouriteScreen() {
    const db = getFirestore(app);
    const { user } = useUser();
    const [favList, setFavList] = useState([]);

    const getFav = () => {
        const q = query(collection(db, "ev-fav-place"),
            where("email", "==", user?.primaryEmailAddress?.emailAddress));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const favPlaces = [];
            querySnapshot.forEach((doc) => {
                favPlaces.push(doc.data());
            });
            setFavList(favPlaces);
        });
        return () => unsubscribe();
    };

    useEffect(() => {
        if (user) {
            const unsubscribe = getFav();
            return () => unsubscribe();
        }
    }, [user]);

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
