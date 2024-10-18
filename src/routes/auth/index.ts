import express from 'express';
import { registerStudent, loginStudent, registerLecturer, loginLecturer } from '../../controllers';
const router = express.Router();

// AUTHENTICATION ROUTES
router.post('/students/register', registerStudent);
router.post('/students/login', loginStudent);
router.post('/lecturers/register', registerLecturer);
router.post('/lecturers/login', loginLecturer);

export default router;