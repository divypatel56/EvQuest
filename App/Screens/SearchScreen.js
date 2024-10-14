import React, { useContext, useEffect, useState } from 'react'; // Import necessary hooks and libraries
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'; // Import core components from react-native
import MapView, { Marker } from 'react-native-maps'; // Import MapView and Marker from react-native-maps
import MapStyle from '../../assets/utils/MapStyle.json'; // Import custom map style JSON file

export default function SearchScreen() {


    return (
        <View style={styles.container}>
            {/* MapView component to render the map */}
            <MapView
                customMapStyle={MapStyle} // Apply the custom map style
                style={styles.map} // Apply the defined styles for the map
            >
            </MapView>
        </View>
    );
}

// Define styles for the components
const styles = StyleSheet.create({
    container: {
        flex: 1, // Make the container take up the entire screen
        backgroundColor: '#f0f0f0', // Set the background color to light grey
    },
    map: {
        flex: 1, // Make the map take up all the available space
        width: Dimensions.get('window').width, // Set the width of the map to the width of the screen
    },
});
