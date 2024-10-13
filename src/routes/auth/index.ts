import express from 'express';
import { registerStudent, loginStudent, registerLecturer, loginLecturer } from '../../controllers/auth';
const router = express.Router();

router.post('/auth/students/register', registerStudent);
router.post('/auth/students/login', loginStudent);
router.post('/auth/lecturers/register', registerLecturer);
router.post('/auth/lecturers/login', loginLecturer);

export default router;