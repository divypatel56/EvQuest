import { View, Text, Image, Dimensions, StyleSheet, Linking, Pressable } from 'react-native';
import React, { useState } from 'react';
import GlobalAPI from '../../../assets/utils/GlobalAPI';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';



const { width: SCREEN_WIDTH } = Dimensions.get('window'); // Screen width

export default function PlaceItem({ place }) {
    const [isFavorite, setIsFavorite] = useState(false); // State to track favorite status
    const PLACE_PHOTO_BASE_URL = "https://places.googleapis.com/v1/";
    const key = GlobalAPI.API_Key;

    // Access latitude and longitude correctly from the place object
    const latitude = place?.location?.latitude;
    const longitude = place?.location?.longitude;

    // Handle direction navigation
    const openGoogleMaps = () => {
        if (latitude && longitude) {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
            Linking.openURL(url).catch(() => Alert.alert('Error', 'Failed to open Google Maps.'));
        } else {
            Alert.alert('Location Error', 'Coordinates not available for this place.');
        }
    };
    // Toggle favorite status
    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
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
                    <FontAwesome5 name="location-arrow" size={16} color="white" onPress={openGoogleMaps} />
                </View>
            </View>

            {/* Information Section */}
            <View style={styles.infoSection}>
                <Text style={styles.placeName}>
                    {place.displayName?.text}
                </Text>

                <Text style={styles.placeAddress}>
                    {place?.shortFormattedAddress}
                </Text>
                <Text style={styles.connectorsLabel}>Connectors</Text>
                <View style={styles.bottomRow}>
                    <Text style={styles.connectorCount}>
                        {/* If connectorCount exists, display the count; otherwise, display "N/A" */}
                        {place?.evChargeOptions?.connectorCount ? place.evChargeOptions.connectorCount + " Points" : "N/A"}
                    </Text>
                    {/* Heart Button */}
                    <Pressable style={styles.heartButton} onPress={toggleFavorite}>
                        <AntDesign
                            name={isFavorite ? "heart" : "hearto"} // Toggle between filled and outlined heart
                            size={16}
                            color="white"
                        //backgroundColor="#6a46ab"
                        />
                    </Pressable>
                </View>


            </View>


        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        width: SCREEN_WIDTH * 0.9, // Match card width with screen width
        backgroundColor: "#ffffff",
        height: 370,
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
        alignItems: 'center', // Align items to place the heart next to the connector count
    },
    heartButton: {
        backgroundColor: "#6a46ab", // Same background color as arrow button
        padding: 12,
        borderRadius: 50,
        zIndex: 10,
        elevation: 5, // slight shadow for the button
    },
    imageWrapper: {
        height: '55%',
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
        padding: 10,
        height: '45%',
        justifyContent: 'space-between'
    },
    placeName: {
        fontFamily: 'Outfit',
        fontSize: 19,
        color: '#333',
        fontWeight: '600',
        marginBottom: 4,
    },
    placeAddress: {
        color: "#666",
        fontFamily: 'Outfit',
        marginBottom: 4,
    },
    connectorsLabel: {
        color: "#999",
        fontFamily: 'Outfit',
        fontSize: 14,
    },
    connectorCount: {
        color: "#333",
        fontFamily: 'Outfit-medium',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 4,
    },
});
