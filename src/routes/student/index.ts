import express from 'express';
import { authenticateStudent } from '../../middleware/auth';
import { addStudent, markAttendance } from '../../controllers/student';
const router = express.Router();

router.post('/onborading', authenticateStudent, addStudent);
router.post('/attendance', authenticateStudent, markAttendance);

export default router;