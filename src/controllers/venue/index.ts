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
        console.log(response);

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
