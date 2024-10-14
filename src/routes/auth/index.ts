import express from 'express';
import { registerStudent, loginStudent, registerLecturer, loginLecturer } from '../../controllers/auth';
import { authenticateLecturer } from '../../middleware/auth';
import { addCourse } from '../../controllers/courses';
const router = express.Router();

router.post('/auth/students/register', registerStudent);
router.post('/auth/students/login', loginStudent);
router.post('/auth/lecturers/register', registerLecturer);
router.post('/auth/lecturers/login', loginLecturer);

router.post('/lecturers/addCourse', authenticateLecturer, addCourse);

export default router;