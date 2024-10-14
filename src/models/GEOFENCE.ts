import { Schema, model, Document, Types } from 'mongoose';

interface IGeofence extends Document {
    latitude: number;
    longitude: number;
    radius: number;
    courses: Types.ObjectId[];
}

const geofenceSchema = new Schema<IGeofence>({
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    radius: { type: Number, required: true },
    courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }]
});

const Geofence = model<IGeofence>('Geofence', geofenceSchema);
export default Geofence;
