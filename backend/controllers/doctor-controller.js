import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js";


const changeAvailability = async(req,res)=>{
    try{
       const {id} = req.body;
       const docData = await doctorModel.findById(id);
       await doctorModel.findByIdAndUpdate(id,{available : !docData.available})
       res.json({
        success:true,
        message : 'Availability changed'
       })
    }
    catch(e){
        console.log(e);
        res.json({
            success:true,
            message : e.message
        })
    }
}

const doctorList = async(req,res)=>{
    try{
       const doctors = await doctorModel.find({}).select(['-password','-email']);
       res.json({
        success:true,
        doctors 
       })
    }
    catch(e){
       console.log(e);
       res.json({success:false,message:e.message})
    }
}

// API for doctor login
const loginDoctor = async(req,res)=>{
    try{
        const {email,password} = req.body;
        const doctorData = await doctorModel.findOne({email});
        if(!doctorData){
            return res.json({
                success:false,
                message : "Invalid credentials"
            })
        }
        const isMatch = await bcrypt.compare(password,doctorData.password);
        if(!isMatch){
            return res.json({
                success:false,
                message : "Wrong password"
            })
        }
        const token = jwt.sign({
            id: doctorData._id
        },process.env.JWT_SECRET);
        res.json({
            success:true,
            token,
            message : "Logged In successfully"
        })
    }
    catch(e){
        console.log(e);
         res.json({success:false,message:e.message})
    }
}


// API to get doctors appointments for doctor panel

const appointmentsDoctor = async(req,res)=>{
    try{
      const {docId} = req.body;
      const appointments = await appointmentModel.find({docId});
     
      res.json({
        success:true,
        appointments
      })
    }
    catch(e){
        console.log(e);
         res.json({success:false,message:e.message})
    }
}
export {changeAvailability,doctorList,loginDoctor,appointmentsDoctor}