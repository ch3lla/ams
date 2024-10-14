import { Schema, model, Document, Types } from 'mongoose';

interface IGeofence extends Document {
    name_of_venue: string;
    latitude: number;
    longitude: number;
    radius: number;
}

const geofenceSchema = new Schema<IGeofence>({
    name_of_venue: { type: String, required: true},
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    radius: { type: Number, required: true }
});

const Geofence = model<IGeofence>('Geofence', geofenceSchema);
export default Geofence;
