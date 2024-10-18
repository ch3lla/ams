import express from 'express';
import { authenticateStudent } from '../../middleware/auth';
import { markAttendance } from '../../controllers/student';
const router = express.Router();

router.post('/attendance', authenticateStudent, markAttendance);

export default router;