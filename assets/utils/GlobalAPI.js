import axios from 'axios';

const BASE_URL = "https://places.googleapis.com/v1/places:searchNearby";
const API_Key = "AIzaSyBisEAZnUdJkLQEB2aM73VUrq31kiG-9W0";


const config = {
    headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_Key,
        'X-Goog-FieldMask':
            ['places.displayName',
                'places.formattedAddress',
                'places.location',
                'places.evChargeOptions',
                'places.shortFormattedAddress',
                'places.photos'
            ]

    }
}

const NewNearByPlace = (data) => axios.post(BASE_URL, data, config);

export default {
    NewNearByPlace, API_Key
}
