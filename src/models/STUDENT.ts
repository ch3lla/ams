import { Schema, model, Types, Document } from 'mongoose';

interface IStudent extends Document {
    first_name: string;
    last_name: string;
    password: string;
    matric_number: string;
    department: Types.ObjectId;
    course_of_study: string;
    level: string;
    email: string;
    role: string;
}

const studentSchema = new Schema<IStudent>({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    password: { type: String, required: true },
    matric_number: { type: String, unique: true, required: true },
    department: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
    course_of_study: { type: String, required: true },
    level: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: 'student' }
});

const Student = model<IStudent>('Student', studentSchema);
export default Student;
