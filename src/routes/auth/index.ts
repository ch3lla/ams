import express from 'express';
import { registerStudent, loginStudent, registerLecturer, loginLecturer } from '../../controllers/auth';
import { authenticateLecturer } from '../../middleware/auth';
import { addCourse, getSingleCourse, removeCourse, updateCourse, viewAllCourses } from '../../controllers/courses';
const router = express.Router();

// AUTHENTICATION ROUTES
router.post('/auth/students/register', registerStudent);
router.post('/auth/students/login', loginStudent);
router.post('/auth/lecturers/register', registerLecturer);
router.post('/auth/lecturers/login', loginLecturer);

// LECTURER ROUTES
router.post('/lecturers/addCourse', authenticateLecturer, addCourse);
router.get('/lecturers/courses', authenticateLecturer, viewAllCourses);
router.get('/lecturers/courses/:courseId', authenticateLecturer, getSingleCourse);
router.patch('/lecturer/courses/:courseId', authenticateLecturer, updateCourse);
router.delete('/lecturers/courses/:courseId', authenticateLecturer, removeCourse);

export default router;