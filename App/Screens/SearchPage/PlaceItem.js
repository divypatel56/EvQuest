import { View, Text, Image, Dimensions, StyleSheet } from 'react-native';
import React from 'react';
import GlobalAPI from '../../../assets/utils/GlobalAPI';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function PlaceItem({ place }) {
    const PLACE_PHOTO_BASE_URL = "https://places.googleapis.com/v1/";
    const key = GlobalAPI.API_Key;

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
                <View style={styles.arrowButton}>
                    <FontAwesome5 name="location-arrow" size={16} color="white" />
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

                <Text style={styles.connectorCount}>
                    {/* If connectorCount exists, display the count; otherwise, display "N/A" */}
                    {place?.evChargeOptions?.connectorCount ? place.evChargeOptions.connectorCount + " Points" : "N/A"}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        width: Dimensions.get("screen").width * 0.9,
        backgroundColor: "#ffffff",
        margin: 15,
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 5 },
        elevation: 8, // Android shadow effect
    },
    imageWrapper: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 180,
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
        padding: 12
    },
    placeName: {
        fontFamily: 'Outfit',
        fontSize: 22,
        color: '#333',
        fontWeight: '600',
        marginBottom: 8,
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
        fontSize: 16,
        fontWeight: '500',
        marginTop: 4,
    },
});
