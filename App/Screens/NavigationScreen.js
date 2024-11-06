import React, { useContext, useEffect, useState, useMemo, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text, FlatList, Alert, ScrollView, KeyboardAvoidingView } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import MapStyle from '../../assets/utils/MapStyle.json';
import GlobalAPI from '../../assets/utils/GlobalAPI';
import { UserLocationContext } from '../Context/UserLocationContext';
import { Image } from 'react-native-elements';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function NavigationScreen({ route }) {
    const { location } = useContext(UserLocationContext);
    const { destination } = route.params;

    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const [steps, setSteps] = useState([]);

    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['25%', '50%', '80%'], []); // Adjusting the snap pointsconst snapPoints = useMemo(() => ['10%', '50%', '90%'], []); // Bottom sheet height at 10%, 50%, and 90%

    useEffect(() => {
        if (location && destination) {
            fetchDirections();
        }
    }, [location, destination]);

    const fetchDirections = async () => {
        const origin = {
            latitude: location.latitude,
            longitude: location.longitude,
        };

        const routeData = await GlobalAPI.getDirections(origin, destination);

        if (routeData) {
            const polylinePoints = decodePolyline(routeData.overview_polyline.points);
            setRouteCoordinates(polylinePoints);
            setSteps(routeData.legs[0].steps);
        } else {
            Alert.alert("No directions found", "We couldn't find a route to your destination.");
        }
    };

    const decodePolyline = (encoded) => {
        let points = [];
        let index = 0, len = encoded.length;
        let lat = 0, lng = 0;

        while (index < len) {
            let b, shift = 0, result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            const deltaLat = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lat += deltaLat;

            shift = 0;
            result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            const deltaLng = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lng += deltaLng;

            points.push({
                latitude: lat / 1e5,
                longitude: lng / 1e5
            });
        }
        return points;
    };

    const renderDirectionIcon = (instruction) => {
        if (instruction.includes('left')) return 'arrow-left';
        if (instruction.includes('right')) return 'arrow-right';
        return 'arrow-up'; // Default to straight arrow
    };

    return location?.latitude && (
        <View style={styles.container}>
            <MapView
                customMapStyle={MapStyle}
                style={styles.map}
                region={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.08,
                    longitudeDelta: 0.08,
                }}
            >
                <Marker
                    coordinate={{
                        latitude: location.latitude,
                        longitude: location.longitude
                    }}
                >
                    <Image
                        source={require('../../assets/Images/locationMark.png')}
                        style={{ width: 50, height: 45, borderRadius: 40 }}
                    />
                </Marker>

                <Marker
                    coordinate={{
                        latitude: destination.latitude,
                        longitude: destination.longitude
                    }}
                    title={destination.displayName}
                    description={destination.shortFormattedAddress}
                >
                    <Image
                        source={require('../../assets/Images/StationMarker.png')}
                        style={{ width: 45, height: 40, borderRadius: 20 }}
                    />
                </Marker>

                {routeCoordinates.length > 0 && (
                    <Polyline
                        coordinates={routeCoordinates}
                        strokeColor="#007AFF"
                        strokeWidth={4}
                    />
                )}
            </MapView>
            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                index={0}
                enablePanDownToClose={false} // Prevent accidental closure on scroll
            >
                <View style={styles.instructionsContainer}>
                    <Text style={styles.instructionsHeader}>Directions:</Text>

                    <BottomSheetFlatList
                        data={steps}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.instructionCard}>
                                <Icon
                                    name={renderDirectionIcon(item.html_instructions)}
                                    size={24}
                                    color="#007AFF"
                                    style={styles.directionIcon}
                                />
                                <View style={styles.textContainer}>
                                    <Text style={styles.instructionText}>
                                        {item.html_instructions.replace(/<[^>]+>/g, '')}
                                        {' '}({item.distance.text})
                                    </Text>
                                </View>
                            </View>
                        )}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        showsVerticalScrollIndicator={true}
                        nestedScrollEnabled={true} // Enable nested scrolling for better handling
                    />
                </View>
            </BottomSheet>


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    map: {
        flex: 1,
        width: Dimensions.get('window').width,
    },
    instructionsContainer: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white',
    },
    instructionsHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: 'Outfit',
    },
    instructionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        padding: 10,
        marginVertical: 5,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    directionIcon: {
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    instructionHeading: {
        fontSize: 14,
        color: '#333',
        fontFamily: 'Outfit',
    },
    instructionText: {
        fontSize: 16,
        color: '#666',
        fontFamily: 'Outfit-medium',
    },
});
