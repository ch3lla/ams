import express from 'express';
import { authenticateStudent, authenticateLecturer } from '../../middleware/auth';
import { getSingleLecturer, getSingleStudent, updateLecturerDetails, updateStudentDetails } from '../../controllers/account';
const router = express.Router();

router.get('/student', authenticateStudent, getSingleStudent);
router.get('/lecturer', authenticateLecturer, getSingleLecturer);
router.put('/student', authenticateStudent, updateStudentDetails);
router.put('/lecturer', authenticateLecturer, updateLecturerDetails);

export default router;