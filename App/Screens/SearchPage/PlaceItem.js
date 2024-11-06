import { View, Text, Image, Dimensions, StyleSheet, Linking, Pressable, ToastAndroid, ScrollView, Alert } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import GlobalAPI from '../../../assets/utils/GlobalAPI';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import { getFirestore } from "firebase/firestore";
import { app } from '../../../assets/utils/FirebaseConfig';
import { doc, setDoc, getDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { useUser } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { UserLocationContext } from '../../Context/UserLocationContext'; // Import UserLocationContext to manage user location globally


const { width: SCREEN_WIDTH } = Dimensions.get('window'); // Screen width

export default function PlaceItem({ place }) {
    const [isFavorite, setIsFavorite] = useState(false); // State to track favorite status
    const PLACE_PHOTO_BASE_URL = "https://places.googleapis.com/v1/";
    const key = GlobalAPI.API_Key;
    const { location: userLocation } = useContext(UserLocationContext);
    const navigation = useNavigation();


    const { user } = useUser();

    // Initialize Cloud Firestore and get a reference to the service
    const db = getFirestore(app);
    // Reference to the fav document
    const favDocRef = doc(db, "ev-fav-place", place.id.toString());
    useEffect(() => {
        const unsubscribe = onSnapshot(favDocRef, (docSnap) => {
            if (docSnap.exists() && docSnap.data().email === user?.primaryEmailAddress?.emailAddress) {
                setIsFavorite(true);
            } else {
                setIsFavorite(false);
            }
        });
        return () => unsubscribe();
    }, [favDocRef, user]);


    // Access latitude and longitude correctly from the place object
    const latitude = place?.location?.latitude;
    const longitude = place?.location?.longitude;
    // Function to show options
    const handleNavigationOptions = () => {
        Alert.alert(
            "Choose Navigation Method",
            "How would you like to navigate?",
            [
                {
                    text: "Google Maps",
                    onPress: () => openGoogleMaps()
                },
                {
                    text: "EvQuest Navigation",
                    onPress: () => navigateToNavigationScreen()
                },
                { text: "Cancel", style: "cancel" }
            ],
            { cancelable: true }
        );
    };

    // Handle direction navigation with google
    const openGoogleMaps = () => {
        if (latitude && longitude) {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
            Linking.openURL(url).catch(() => Alert.alert('Error', 'Failed to open Google Maps.'));
        } else {
            Alert.alert('Location Error', 'Coordinates not available for this place.');
        }
    };

    // Update function to navigate to NavigationScreen
    const navigateToNavigationScreen = () => {
        if (userLocation && latitude && longitude) {
            console.log('Navigating with origin:', userLocation, 'and destination:', { latitude, longitude });
            navigation.navigate('NavigationScreen', {
                origin: userLocation,
                destination: { latitude, longitude },
            });
        } else {
            Alert.alert('Location Error', 'Coordinates not available for this place or user.');
        }
    };

    // Format URL to show only domain if too long
    const formatUrl = (url) => {
        try {
            const urlObj = new URL(url);
            const formattedUrl = `${urlObj.hostname}${urlObj.pathname.length > 20 ? urlObj.pathname.substring(0, 20) + '...' : urlObj.pathname}`;
            return formattedUrl;
        } catch (error) {
            console.error("Error formatting URL:", error);
            return url; // Return original URL if parsing fails
        }
    };
    // Toggle favorite status and handle add/remove to favorites collection
    const toggleFavorite = async () => {
        if (!place || !place.id) return; // Exit if no place data
        try {
            const docSnap = await getDoc(favDocRef);

            if (docSnap.exists()) {
                // If the document exists and belongs to the current user, remove it from favorites
                if (docSnap.data().email === user?.primaryEmailAddress?.emailAddress) {
                    await deleteDoc(favDocRef);
                    setIsFavorite(false);
                    ToastAndroid.show("Removed from Favourites", ToastAndroid.TOP);
                }
            } else {
                // If the document does not exist, add it to favorites with user email
                await setDoc(favDocRef, {
                    place: place,
                    email: user?.primaryEmailAddress?.emailAddress || "Unknown" // Use user email
                });
                setIsFavorite(true);
                ToastAndroid.show("Added to Favourites", ToastAndroid.TOP);
            }
        } catch (error) {
            console.error("Error toggling favorite status: ", error);
            ToastAndroid.show("Error updating Favourite!", ToastAndroid.TOP);
        }
    };

    return (
        <View style={styles.cardContainer}>
            {/* Image and Gradient Overlay */}
            <View style={styles.imageWrapper}>
                <Image
                    source={
                        place?.photos && place?.photos[0]?.name ?
                            {
                                uri: `${PLACE_PHOTO_BASE_URL}${place.photos[0].name}/media?key=${key}&maxHeightPx=800&maxWidthPx=1200`
                            }
                            : require('../../../assets/Images/station.png')
                    }
                    style={styles.image}
                    resizeMode='cover'
                />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)']}
                    style={styles.imageGradient}
                />

                {/* Direction Arrow */}
                <View style={styles.arrowButton} >
                    <FontAwesome5 name="location-arrow" size={16} color="white" onPress={handleNavigationOptions} />
                </View>
            </View>

            {/* Information Section (Scrollable) */}
            <ScrollView style={styles.infoSection} contentContainerStyle={styles.infoContainer}>
                <Text style={styles.placeName} numberOfLines={1} ellipsizeMode="tail">
                    {place.displayName?.text}
                </Text>
                <Text style={styles.placeAddress} numberOfLines={1} ellipsizeMode="tail">
                    {place?.shortFormattedAddress}
                </Text>
                {place.website && (
                    <Text style={styles.placeUrl} onPress={() => Linking.openURL(place?.website)}>
                        {formatUrl(place?.website)}
                    </Text>
                )}
                <Text style={styles.connectorsLabel}>Connectors</Text>
                <View style={styles.bottomRow}>
                    <Text style={styles.connectorCount}>
                        {place?.evChargeOptions?.connectorCount ? place.evChargeOptions.connectorCount + " Points" : "N/A"}
                    </Text>
                    <Pressable style={styles.heartButton} onPress={toggleFavorite}>
                        <AntDesign
                            name={isFavorite ? "heart" : "hearto"}
                            size={18}
                            color="white"
                        />
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    cardContainer: {
        width: SCREEN_WIDTH * 0.9, // Match card width with screen width
        backgroundColor: "#ffffff",
        height: 350,
        marginHorizontal: SCREEN_WIDTH * 0.050, // Only vertical margin to prevent spacing issues in horizontal scroll
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 5 },
        elevation: 8,// Android shadow effect
        marginBottom: 10
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    imageWrapper: {
        height: SCREEN_WIDTH * 0.50, // Set dynamic height relative to width
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },

    imageGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '50%',
    },
    arrowButton: {
        position: 'absolute',
        bottom: 15,
        right: 15,
        backgroundColor: "#6a46ab",
        padding: 12,
        borderRadius: 50,
        zIndex: 10,
        elevation: 5, // slight shadow for the button
    },
    infoSection: {
        height: 140, // Set this to control scroll area height
        paddingHorizontal: 10,
    },
    infoContainer: {
        paddingVertical: 10,
    },
    placeName: {
        fontFamily: 'Outfit',
        fontSize: 20,
        color: '#333',
        fontWeight: '600',
        marginBottom: 4,

    },
    placeAddress: {
        color: "#666",
        fontFamily: 'Outfit',
        marginBottom: 4,
    },
    placeUrl: {
        color: '#1E90FF',
        textDecorationLine: 'underline',
        fontFamily: 'Outfit',
        fontSize: 14,
    },
    connectorsLabel: {
        color: "#999",
        fontFamily: 'Outfit',
        fontSize: 17,
    },
    connectorCount: {
        color: "#333",
        fontFamily: 'Outfit-medium',
        fontSize: 17,
        fontWeight: '500',
        marginBottom: 4,
    },
    heartButton: {
        backgroundColor: "#6a46ab", // Same background color as arrow button
        padding: 12,
        borderRadius: 50,
        zIndex: 10,
        elevation: 7, // slight shadow for the button
        marginBottom: 14,
    },
});
