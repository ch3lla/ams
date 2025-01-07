import axios from 'axios';
import 'dotenv/config';

/**
 * Function to get the coordinates (longitude and latitude) of a venue using Google Maps Geocoding API.
 * @param venueName - The name of the venue (address or place name).
 * @param apiKey - Your Google Maps API Key.
 * @returns An object containing latitude and longitude of the venue.
 */
async function getVenueCoordinates(venueName: string): Promise<{ latitude: number, longitude: number } | null> {
    try {
        // Encode the venue name for the URL
        const encodedVenueName = encodeURIComponent(venueName);
        
        // Geocoding API URL
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedVenueName}&key=${process.env.GOOGLE_MAPS_API_KEY!}`;

        // Make the request to the Geocoding API
        const response = await axios.get(url);

        // Check if a result is found
        if (response.data.status === 'OK' && response.data.results.length > 0) {
            const location = response.data.results[0].geometry.location;
            const venue = {
                latitude: location.lat,
                longitude: location.lng
            };
            return await addVenueToSchema(venueName, venue);
        } else {
            console.error('No results found for the specified venue.');
            return null;
        }
    } catch (error) {
        console.error('Error fetching venue coordinates:', error);
        return null;
    }
}

// const TOMTOM_API_KEY = process.env.TOM_TOM_API_KEY!; // Replace with your TomTom API key

/**
 * Function to get the coordinates of a venue using TomTom's Search API.
 * @param venueName The name of the venue.
 * @returns Promise<{ latitude: number, longitude: number }> The latitude and longitude of the venue.
 */
// async function getVenueCoordinates(venueName: string): Promise<{ latitude: number; longitude: number }> {
//     try {
//         // Make a request to the TomTom Search API
//         const response = await axios.get(`https://api.tomtom.com/search/2/geocode/${encodeURIComponent(venueName)}.json`, {
//             params: {
//                 key: TOMTOM_API_KEY,
//                 limit: 1 // Limit the results to the top result
//             }
//         });

//         // Extract the data from the response
//         const { data } = response;
//         if (data.results.length === 0) {
//             throw new Error('No results found for the given venue name.');
//         }

//         const { lat, lon } = data.results[0].position;

//         const venue = {
//             latitude: lat,
//             longitude: lon
//         };
//         return await addVenueToSchema(venueName, venue);
//     } catch (error) {
//         console.error('Error fetching venue coordinates:', error);
//         throw new Error('Failed to fetch venue coordinates.');
//     }
// }

// Example usage
// (async () => {
//     const venueName = 'Bucodel-Babcock University, Ilishan-Remo, Ogun State, Nigeria';
//     try {
//         const coordinates = await getVenueCoordinates(venueName);
//         console.log(`Coordinates of ${venueName}: Latitude: ${coordinates.latitude}, Longitude: ${coordinates.longitude}`);
//     } catch (error) {
//         console.error('Error:', error);
//     }
// })();

const addVenueToSchema = async (name: string, venue: any) => {
    const classVenue = new venue({
        name_of_venue: name,
        latitude: venue.latitude,
        longitude: venue.longitude,
        radius: 20
    });
    await classVenue.save();
    return classVenue._id;
};

export default getVenueCoordinates;
