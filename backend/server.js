import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongoDB.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoutes.js';
// app config

const app = express();

const port = process.env.PORT || 4000
connectDB();
connectCloudinary();

// middlewares
console.log(process.env.CLIENT_URL1);
console.log(process.env.CLIENT_URL2);
app.use(express.json())
app.use(cors())

// api endpoints

app.use('/api/admin',adminRouter);
// localhost:4000/api/admin/add-doctor
app.use('/api/doctor',doctorRouter);
app.use('/api/user',userRouter);
app.get('/',(req,res)=>{
    res.send("Api working great");
});

app.listen(port,()=>console.log("Server started",port))

