import express from 'express';
import { registerStudent, loginStudent, registerLecturer, loginLecturer, verifyToken } from '../../controllers/auth';
import { authenticate } from '../../middleware/auth';
const router = express.Router();

// AUTHENTICATION ROUTES
router.post('/students/register', registerStudent);
router.post('/students/login', loginStudent);
router.post('/lecturers/register', registerLecturer);
router.post('/lecturers/login', loginLecturer);
router.get('/verify-token', authenticate, verifyToken);

export default router;