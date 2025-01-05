import { Schema, model, Model, Types, Document } from 'mongoose';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import 'dotenv/config';

interface ILecturer extends Document {
    first_name: string;
    last_name: string;
    password: string;
    department: Types.ObjectId;
    email: string;
    role: string;
    courses_teaching: Types.ObjectId[];
    generateAuthToken: () => Promise<{ token: string }>;
    findByCredentials: () => Promise<{ user: ILecturer}>
}

interface ILecturerModel extends Model<ILecturer> {
  findByCredentials(email: string, password: string): Promise<ILecturer>;
}

const lecturerSchema = new Schema<ILecturer>({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    password: { type: String, required: true },
    department: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: 'lecturer' },
    courses_teaching: [{ type: Schema.Types.ObjectId, ref: 'Course' }]
}, {
  timestamps: true
});

lecturerSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = sign({ _id: user._id.toString(), role: user.role }, process.env.JWT_SECRET_KEY!, { expiresIn: '5h' });
  return token;
};

lecturerSchema.statics.findByCredentials = async (email: string, password: string): Promise<ILecturer> => {
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
    const user = this as ILecturer;
    if (user.isModified('password')) {
      user.password = await hash(user.password, 8);
    }
    next();
});

const Lecturer = model<ILecturer, ILecturerModel>('Lecturer', lecturerSchema);
export default Lecturer;
