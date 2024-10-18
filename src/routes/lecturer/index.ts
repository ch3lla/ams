import express from 'express';
import { authenticateLecturer } from '../../middleware/auth';
import { addCourse, getSingleCourse, removeCourse, updateCourse, viewAllCourses, generateQRCodeForCourse } from '../../controllers/courses';
const router = express.Router();

// LECTURER ROUTES
router.post('/addCourse', authenticateLecturer, addCourse);
router.post('/courses/:courseId', authenticateLecturer, generateQRCodeForCourse);
router.get('/courses', authenticateLecturer, viewAllCourses);
router.get('/courses/:courseId', authenticateLecturer, getSingleCourse);
router.patch('/courses/:courseId', authenticateLecturer, updateCourse);
router.delete('/courses/:courseId', authenticateLecturer, removeCourse);

export default router;