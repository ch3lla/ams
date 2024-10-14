import { Request, Response } from 'express';
import Student from '../../models/STUDENT';
import Lecturer from '../../models/LECTURER';

const registerStudent = async (req: Request, res: Response) => {
    const studentData = req.body;
        const alreadyExists = await Student.findOne({ matric_number: req.body.matric_number});

        if (alreadyExists) {
            res.status(400).json({ message: 'This matric_number belongs to an account.' });
            return;
          }

    try {
        if (typeof studentData !== 'object' || Object.keys(studentData).length === 0) {
            res.status(400).json({ message: 'Please fill all the required fields' });
            return;
          }
        const student = new Student(studentData);
        await student.save();
        const token = await student.generateAuthToken();
        res.status(201).json({ message: "Student registered successfully", accessToken: token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while registering the student.' });
    }
};

const loginStudent = async (req: Request, res: any) => {
    try {
        const { matric_number, password } = req.body;
        const student = await Student.findByCredentials(matric_number, password);

        if (!student) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = await student.generateAuthToken();
        return res.status(201).json({ mesage: "Login successful", accessToken: token });

    } catch (error) {
        console.error
        return res.status(500).json({ message: 'An error occurred while signing in the student.' });
    }
};

const registerLecturer = async (req: Request, res: any) => {
    const lecturerData = req.body;
    const alreadyExists = await Lecturer.findOne({ email: req.body.email });
    if (alreadyExists){
        return res.status(400).json({ message: "email taken!"});
    }
    try {      

        const lecturer = new Lecturer(lecturerData);
        await lecturer.save();
        const token = await lecturer.generateAuthToken();
        res.status(201).json({ message: "Lecturer registered successfully", accessToken: token });

    } catch (error) {
        console.error
        res.status(500).json({ message: 'An error occurred while registering the lecturer.' });
    }
};

const loginLecturer = async (req: Request, res: any) => {
    try {
        const { email, password } = req.body;
        const lecturer = await Lecturer.findByCredentials(email, password);

        if (!lecturer) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = await lecturer.generateAuthToken();
        return res.status(201).json({ mesage: "Login successful", accessToken: token});

    } catch (error) {
        console.error
        return res.status(500).json({ message: 'An error occurred while signing in lecturer.' });
    }
};

export {
    registerStudent,
    registerLecturer,
    loginStudent,
    loginLecturer,
}