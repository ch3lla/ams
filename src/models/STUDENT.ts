import { Schema, model, Model, Types, Document } from 'mongoose';
import { compare, hash } from 'bcrypt'
import { sign } from 'jsonwebtoken';
import 'dotenv/config';

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

    generateAuthToken: () => Promise<{ token: string }>;
    findByCredentials: () => Promise<{ user: IStudent}>
}

// Create a type for the static methods
interface IStudentModel extends Model<IStudent> {
    findByCredentials(email: string, password: string): Promise<IStudent>;
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


studentSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = sign({ _id: user._id.toString(), role: user.role }, process.env.JWT_SECRET_KEY!, { expiresIn: '5h' });
    return { token };
};

studentSchema.statics.findByCredentials = async (matric_number: string, password: string): Promise<IStudent> => {
    const user = await Student.findOne({ matric_number });
    if (!user) {
      throw new Error('This email has not been registered on our system.');
    }
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid password');
    }
    return user;
};
  
studentSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
      user.password = await hash(user.password, 8);
    }
    next();
});

const Student = model<IStudent, IStudentModel>('Student', studentSchema);
export default Student;
