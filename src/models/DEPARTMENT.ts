import { Schema, model, Types, Document } from 'mongoose';

interface IDepartment extends Document {
    department_name: string;
    lecturers: Types.ObjectId[];
    students: Types.ObjectId[];
    courses: Types.ObjectId[];
}

const departmentSchema = new Schema<IDepartment>({
    department_name: { type: String, required: true },
    lecturers: [{ type: Schema.Types.ObjectId, ref: 'Lecturer' }],
    students: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }]
});

const Department = model<IDepartment>('Department', departmentSchema);
export default Department;
