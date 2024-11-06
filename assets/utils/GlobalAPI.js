import axios from 'axios';

const BASE_URL_NEARBY = "https://places.googleapis.com/v1/places:searchNearby";
const BASE_URL_DETAILS = "https://maps.googleapis.com/maps/api/place/details/json";
const BASE_URL_DIRECTIONS = "https://maps.googleapis.com/maps/api/directions/json";
const API_Key = "AIzaSyBisEAZnUdJkLQEB2aM73VUrq31kiG-9W0";


const configNearby = {
    headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_Key,
        'X-Goog-FieldMask':
            ['places.displayName',
                'places.formattedAddress',
                'places.location',
                'places.evChargeOptions',
                'places.shortFormattedAddress',
                'places.photos', 'places.id',
                'places.price_level'
            ]

    }
}


const NewNearByPlace = (data) => axios.post(BASE_URL_NEARBY, data, configNearby);

// Fetch specific details for a place using place_id
const getPlaceDetails = async (placeId) => {
    try {
        // Append `place_id`, `fields`, and `key` as query parameters
        const url = `${BASE_URL_DETAILS}?place_id=${placeId}&fields=website&key=${API_Key}`;
        const response = await axios.get(url);
        const details = response.data.result;

        // Log the required fields
        // console.log(`Details for place_id ${placeId}:`);
        // console.log(`Website: ${details.website}`);
        //console.log(`Price Level: ${details.price_level}`);

        return details;
    } catch (error) {
        console.error(`Error fetching details for place_id ${placeId}:`, error);
    }
};

// Directions request function
const getDirections = async (origin, destination) => {
    try {
        const originParam = `${origin.latitude},${origin.longitude}`;
        const destinationParam = `${destination.latitude},${destination.longitude}`;
        const url = `${BASE_URL_DIRECTIONS}?origin=${originParam}&destination=${destinationParam}&key=${API_Key}&mode=driving`;

        const response = await axios.get(url);

        // Check if the response contains routes
        if (response.data.routes.length === 0) {
            console.error("No routes found in response.");
            return null;
        }

        const route = response.data.routes[0]; // Get the first route
        return route; // Return the route for further processing
    } catch (error) {
        console.error(`Error fetching directions:`, error);
    }
};

export default {
    NewNearByPlace,
    getPlaceDetails,
    getDirections,
    API_Key
};