import express from 'express'
import { appointmentsDoctor, doctorList, loginDoctor } from '../controllers/doctor-controller.js';
import authDoctor from '../middleware/authDoctor.js';

const router = express.Router();

router.get('/list',doctorList);
router.post('/login',loginDoctor);
router.get('/appointments',authDoctor,appointmentsDoctor);

export default router;