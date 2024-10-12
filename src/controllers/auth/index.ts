import { Request, Response } from 'express';
import { Student } from '../../models/STUDENT';
import bcrypt from 'bcrypt';
import { AppDataSource } from '../../config/dataSoure';
import { generateToken } from '../../middleware/auth';
import { Lecturer } from '../../models/LECTURER';

const registerStudent = async (req: Request, res: Response) => {
    try {
        const { password, ...studentData } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const studentRepository = AppDataSource.getRepository(Student);
        const student = studentRepository.create({
            ...studentData,
            password: hashedPassword,
        });

        await studentRepository.save(student);
        res.status(201).json({ message: "Student registered successfully" });

    } catch (error) {
        console.error
        res.status(500).json({ message: 'An error occurred while registering the student.' });
    }
};

const loginStudent = async (req: Request, res: Response) => {
    try {
        const { matricNo, password } = req.body;

        const studentRepository = AppDataSource.getRepository(Student);
        const student = await studentRepository.findOne({ where: {matric_number: matricNo} });

        if (!student) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, student.password);
    
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = generateToken(student.id, student.role);
        res.status(201).json({ token});

    } catch (error) {
        console.error
        res.status(500).json({ message: 'An error occurred while signing in the student.' });
    }
};


const registerLecturer = async (req: Request, res: Response) => {
    try {
        const { password, ...lecturerData } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const lecturerRepository = AppDataSource.getRepository(Lecturer);
        const lecturer = lecturerRepository.create({
            ...lecturerData,
            password: hashedPassword,
        });

        await lecturerRepository.save(lecturer);
        res.status(201).json({ message: "Lecturer registered successfully" });

    } catch (error) {
        console.error
        res.status(500).json({ message: 'An error occurred while registering the lecturer.' });
    }
};

const loginLecturer = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const lecturerRepository = AppDataSource.getRepository(Lecturer);
        const lecturer = await lecturerRepository.findOne({ where: {email: email} });

        if (!lecturer) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, lecturer.password);
    
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = generateToken(lecturer.id, lecturer.role);
        res.status(201).json({ token});

    } catch (error) {
        console.error
        res.status(500).json({ message: 'An error occurred while signing in lecturer.' });
    }
};

export {
    registerStudent,
    registerLecturer,
    loginStudent,
    loginLecturer,
}