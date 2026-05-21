import express from "express";

import { addDoctor,allDoctors,appointmentsAdmin,loginAdmin,appointmentCancel, adminDashboard } from "../controllers/admin-controller.js";

import upload from "../middleware/multer.js";
import authAdmin from "../middleware/authAdmin.js";
import { changeAvailability } from "../controllers/doctor-controller.js";

const adminRouter = express.Router();

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor);
adminRouter.post('/login',loginAdmin);
adminRouter.get('/all-doctors',authAdmin,allDoctors);
adminRouter.put('/change-availability',authAdmin,changeAvailability);
adminRouter.get('/appointments',authAdmin,appointmentsAdmin);
adminRouter.post('/cancel-appointment',authAdmin,appointmentCancel);
adminRouter.get('/dashboard',authAdmin,adminDashboard);
export default adminRouter;