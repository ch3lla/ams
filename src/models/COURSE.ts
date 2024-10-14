import { Schema, model, Types, Document } from 'mongoose';

interface ICourse extends Document {
    lecturer: Types.ObjectId;
    course_code: string;
    course_name: string;
    qr_code?: string;
    semester: '1' | '2';
    department: Types.ObjectId;
    attendances: Types.ObjectId[];
    students: Types.ObjectId[];
    venue: Types.ObjectId[];
}

const courseSchema = new Schema<ICourse>({
    lecturer: { type: Schema.Types.ObjectId, ref: 'Lecturer', required: true },
    course_code: { type: String, unique: true, required: true },
    course_name: { type: String, required: true },
    qr_code: { type: String, default: null },
    semester: { type: String, enum: [1, 2], required: true },
    department: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
    attendances: [{ type: Schema.Types.ObjectId, ref: 'Attendance' }],
    students: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    venue: [{ type: Schema.Types.ObjectId, ref: 'Geofence' }]
});

const Course = model<ICourse>('Course', courseSchema);
export default Course;