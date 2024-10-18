import { Schema, model, Document, Types } from 'mongoose';

interface IVenue extends Document {
    name_of_venue: string;
    latitude: number;
    longitude: number;
    radius: number;
}

const venueSchema = new Schema<IVenue>({
    name_of_venue: { type: String, required: true},
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    radius: { type: Number, required: true }
});

const Venue = model<IVenue>('Venue', venueSchema);
export default Venue;
