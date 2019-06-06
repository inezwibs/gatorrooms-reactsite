import axios from 'axios';

export const getGeocodingInfo = (apiKey, address, onSuccess) => {
    axios
        .get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`)
        .then(onSuccess);
}