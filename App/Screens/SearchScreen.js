//SerachScreen
// -------------------------- Imports --------------------------

// Core React and React Native components
import React, { useContext, useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

// Core React and React Native components
import MapView, { Marker } from 'react-native-maps';

// Location and external libraries
//import * as Location from 'expo-location'; // Import Location API to get user's location
import { Image } from 'react-native-elements'; // Import Image component for custom marker icons

// Utilities and Contexts
import MapStyle from '../../assets/utils/MapStyle.json'; // Custom Google Map style for styling the map
import GlobalAPI from '../../assets/utils/GlobalAPI'; // Import the API utility for fetching nearby places
import { UserLocationContext } from '../Context/UserLocationContext'; // Import UserLocationContext to manage user location globally

// Custom Components
import Searchbar from '../Screens/SearchPage/SearchBar'; // Import the custom search bar 
import PlaceListView from './SearchPage/PlaceListView';  // List view for nearby places

// -------------------------- Component --------------------------
/**
 * SearchScreen Component
 * Displays a map with nearby EV charging stations and provides a search bar
 * for searching places and a list of nearby stations.
 */
export default function SearchScreen() {
    // Context: Access user's current location and setter from UserLocationContext
    const { location, setLocation } = useContext(UserLocationContext);

    // State to manage the list of nearby places
    const [placeList, setPlaceList] = useState([]);
    const placeListRef = useRef(null); // Ref to access PlaceListView functions

    // useEffect hook to fetch nearby places whenever the location changes
    useEffect(() => {
        // If location is available, fetch nearby places
        location && GetNearbyPlace();
    }, [location]); // Dependency on `location` state to run the effect when location updates

    // Fetch nearby EV charging stations based on the user's location
    const GetNearbyPlace = async () => {
        // Data object with search parameters, including types and location restriction
        const data = {
            "includedTypes": ["electric_vehicle_charging_station"], // Search for EV charging stations
            "maxResultCount": 15, // Limit results to 10
            "locationRestriction": {
                "circle": {
                    "center": {
                        "latitude": location?.latitude, // Center the search at user's latitude
                        "longitude": location?.longitude // Center the search at user's longitude
                    },
                    "radius": 5000.0 // Radius of 5 kilometers for the search area
                }
            }
        };
        // Call the API to get nearby places and log the response
        GlobalAPI.NewNearByPlace(data).then(async resp => {
            const places = resp.data?.places;

            // Fetch and log details for each place
            if (places && places.length) {
                const placesWithDetails = await Promise.all(places.map(async (place) => {
                    const details = await GlobalAPI.getPlaceDetails(place.id);
                    return { ...place, website: details?.website }; // Add website to the place object
                }));
                setPlaceList(placesWithDetails);
            }
        }).catch(error => {
            console.error('Error fetching nearby places:', error);
        })
    };

    // Handle marker press: Scroll to the corresponding item in the list
    const handleMarkerPress = (index) => {
        // Call the scrollToIndex function in PlaceListView
        placeListRef.current?.scrollToIndex(index);
    };

    //To handle search location from searchbar
    const handleSearchedLocation = (newLocation) => {
        setLocation({
            latitude: newLocation.lat,
            longitude: newLocation.lng,
        });
    };

    // -------------------------- UI Rendering --------------------------

    // If user's location is available, render the map and markers
    return location?.latitude && (
        <View style={styles.container}>
            <MapView
                customMapStyle={MapStyle} // Apply custom map styling
                style={styles.map} // Apply styles to the map
                region={{
                    latitude: location?.latitude, // User's current latitude
                    longitude: location?.longitude, // User's current longitude
                    latitudeDelta: 0.0800, // Map zoom level
                    longitudeDelta: 0.0821, // Map zoom level
                }}
            >
                <Marker
                    coordinate={{
                        latitude: location?.latitude, // User's current latitude
                        longitude: location?.longitude // User's current longitude
                    }}
                >
                    <Image
                        source={require('../../assets/Images/locationMark.png')} // Custom image for marker icon
                        style={{ width: 50, height: 45, border: 1, borderRadius: 40 }} // Style for marker icon
                    />
                </Marker>

                {placeList.map((item, index) => (
                    <Marker
                        key={index}
                        coordinate={{
                            latitude: item.location.latitude,
                            longitude: item.location.longitude,
                        }}
                        onPress={() => handleMarkerPress(index)} // Scroll to card on marker press
                        title={item.displayName?.text}
                        description={item.shortFormattedAddress}
                    >
                        <Image
                            source={require('../../assets/Images/StationMarker.png')} // Custom image for marker icon
                            style={{ width: 45, height: 40, border: 1, borderRadius: 20, }} // Style for marker icon
                        />

                    </Marker>
                ))}
            </MapView>

            <View style={styles.searchBar}>
                <Searchbar searchedLocation={handleSearchedLocation} />
            </View>


            <View style={styles.placeListContainer}>
                {placeList && <PlaceListView placeList={placeList} ref={placeListRef} />}
            </View>
        </View>
    );
}

// -------------------------- Styles --------------------------

/**
 * Styles for the Search Screen component
 */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    map: {
        flex: 1,
        width: Dimensions.get('window').width,
    },
    searchBar: {
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
        zIndex: 1000,
    },
    reloadButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#007AFF',
        borderRadius: 30,
        padding: 15,
        elevation: 5,
    },
    placeListContainer: {
        position: 'absolute',
        bottom: 0,
        zIndex: 4,

        width: '100%'
    },

});