import { Schema, model, Types, Document } from 'mongoose';

interface ILecturer extends Document {
    first_name: string;
    last_name: string;
    password: string;
    department: Types.ObjectId;
    email: string;
    role: string;
    courses_teaching: Types.ObjectId[];
}

const lecturerSchema = new Schema<ILecturer>({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    password: { type: String, required: true },
    department: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: 'lecturer' },
    courses_teaching: [{ type: Schema.Types.ObjectId, ref: 'Course' }]
});

const Lecturer = model<ILecturer>('Lecturer', lecturerSchema);
export default Lecturer;
