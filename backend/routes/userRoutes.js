import express from 'express'
import { bookAppointment, getAllAppointments, getProfile, loginUser, registerUser, updateProfile,cancelAppointment,paymentRazorpay, verifyRazorpay } from '../controllers/user-controller.js';
import authUser from '../middleware/authUser.js';
import upload from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.post('/register',registerUser);
userRouter.post('/login',loginUser);
userRouter.get('/get-profile',authUser,getProfile);
userRouter.post('/update-profile',authUser,upload.single('image'),updateProfile);
userRouter.post('/book-appointment',authUser,bookAppointment);
userRouter.get('/appointments',authUser,getAllAppointments);
userRouter.post('/cancel-appointment',authUser,cancelAppointment);
userRouter.post('/payment-razorpay',authUser,paymentRazorpay);
userRouter.post('/verifyRazorpay',authUser,verifyRazorpay);
export default userRouter;