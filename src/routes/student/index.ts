import express from 'express';
import { authenticateStudent } from '../../middleware/auth';
import { markAttendance, getAllCoursesOfferedByStudent, getSingleCourseOfferedByStudent } from '../../controllers/student';
const router = express.Router();

router.post('/attendance', authenticateStudent, markAttendance);
router.get('/courses', authenticateStudent, getAllCoursesOfferedByStudent);
router.get('/courses/:courseId', authenticateStudent, getSingleCourseOfferedByStudent);
  
export default router;