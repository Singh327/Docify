import express from 'express'
import { appointmentsDoctor, doctorList, loginDoctor,appointmentCancel,appointmentComplete, doctorDashboard, doctorProfile, updateDoctorProfile } from '../controllers/doctor-controller.js';
import authDoctor from '../middleware/authDoctor.js';

const router = express.Router();

router.get('/list',doctorList);
router.post('/login',loginDoctor);
router.get('/appointments',authDoctor,appointmentsDoctor);
router.post('/appointment-cancel',authDoctor,appointmentCancel);
router.post('/appointment-complete',authDoctor,appointmentComplete);
router.get('/dashboard',authDoctor,doctorDashboard);
router.get('/profile',authDoctor,doctorProfile);
router.post('/update-profile',authDoctor,updateDoctorProfile);

export default router;