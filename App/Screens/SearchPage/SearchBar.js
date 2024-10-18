import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library

const GooglePlacesInput = ({ searchedLocation }) => {
    return (
        <View style={styles.container}>
            <GooglePlacesAutocomplete
                placeholder="Search for EV charging stations..."
                fetchDetails={true}
                enablePoweredByContainer={false}
                onPress={(data, details = null) => {
                    // 'details' is provided when fetchDetail = true
                    searchedLocation(details?.geometry?.location)
                }}
                query={{
                    key: 'AIzaSyBisEAZnUdJkLQEB2aM73VUrq31kiG-9W0',
                    language: 'en',
                }}
                styles={{
                    textInput: styles.textInput,
                    container: { flex: 0 },
                    listView: { backgroundColor: 'white' }
                }}

            />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    textInput: {
        height: 44,
        color: '#5d5d5d',
        fontSize: 16,
        borderRadius: 20,
        paddingHorizontal: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#ddd',
        borderWidth: 1,
    },
});


export default GooglePlacesInput;