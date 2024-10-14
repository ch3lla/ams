import { Schema, model, Types, Document } from 'mongoose';
import { compare, hash } from 'bcrypt'

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

lecturerSchema.statics.findByCredentials = async (email, password) => {
    const user = await Lecturer.findOne({ email });
    if (!user) {
      throw new Error('This email has not been registered on our system.');
    }
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid password');
    }
    return user;
};
  
lecturerSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
      user.password = await hash(user.password, 8);
    }
    next();
});

const Lecturer = model<ILecturer>('Lecturer', lecturerSchema);
export default Lecturer;
