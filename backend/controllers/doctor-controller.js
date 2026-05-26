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
    const docId = req.user.id;
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

// API to mark appointment completed for doctor panel
const appointmentComplete = async(req,res)=>{
    try{
      const {appointmentId} = req.body;
      const docId = req.user.id;
      const appointmentData = await appointmentModel.findById(appointmentId);
      if(appointmentData && appointmentData.docId === docId){
                    await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true});
                    const {slotDate, slotTime} = appointmentData;
                    const docData = await doctorModel.findById(docId);
                    let slots_booked = docData.slots_booked;
                    if (slots_booked && slots_booked[slotDate]){
                             slots_booked[slotDate] = slots_booked[slotDate].filter(time=>time!==slotTime);
                             await doctorModel.findByIdAndUpdate(docId,{slots_booked});
                    }
          return res.json({
            success:true,
            message : "Appointment completed"
          })
      }
     else{
         return res.json({
            success:false,
            message : "Mark failed"
          })
     }
    }
    catch(e){
         console.log(e);
         res.json({success:false,message:e.message})
    }
}


// APi to cancel appointment for docotor panel
const appointmentCancel =async(req,res)=>{
    try{
      const {appointmentId} = req.body;
      const docId = req.user.id;
      const appointmentData = await appointmentModel.findById(appointmentId);
      if(appointmentData && appointmentData.docId === docId){
          await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true});
           const {slotDate,slotTime} = appointmentData;
          const docData = await doctorModel.findById(docId);
          let slots_booked = docData.slots_booked;
           slots_booked[slotDate] = slots_booked[slotDate].filter(time=>time!==slotTime);
           await doctorModel.findByIdAndUpdate(docId,{slots_booked});
          return res.json({
            success:true,
            message : "Appointment cancelled"
          })
      }
     
     
     else{
         return res.json({
            success:false,
            message : "Cancellation failed"
          })
     }
    }
    catch(e){
         console.log(e);
         res.json({success:false,message:e.message})
    }
}

// API to get dahsboard data for doctor panel

const doctorDashboard = async(req,res)=>{
    try{
       const docId = req.user.id;
       const appointments = await appointmentModel.find({docId});

       let earnings = 0;

       appointments.map((item)=>{
        if(item.payment || item.isCompleted){
             earnings = earnings + item.amount;
        }
       })
       let patients = [];
       appointments.map((item)=>{
          if(!patients.includes(item.userId)){
             // inserting unique patients in array
             patients.push(item.userId);
          }

       })
       const dashData= {
        earnings,
        appointments : appointments.length,
        patients : patients.length,
        latestAppointments : appointments.reverse().slice(0,5)
       }
      
      res.json({
         success:true,
         dashData
      })
    }
    catch(e){
         console.log(e);
         res.json({success:false,message:e.message})
    }
}

// API to get doctor profile for doctor pannel


const doctorProfile = async(req,res)=>{
    try{
        const docId  = req.user.id;
        const profileData = await doctorModel.findById(docId).select('-password');
        console.log(profileData);
        res.json({
            success:true,
            profileData
        })
    }
    catch(e){
       
    }
}

// API to update doctor profile data from doctor panel

const updateDoctorProfile = async(req,res)=>{
    try{
      const docId = req.user.id;
      const {fees,address,available} = req.body;
     const updatedData = await doctorModel.findByIdAndUpdate(docId,{available,fees,address})
     
      res.json({
        success:true,
    
        message : "Profile updated successfully"
      })
    }
   catch(e){
      console.log(e);
         res.json({success:false,message:e.message})
   }
}

export {changeAvailability
    ,doctorList,loginDoctor,
    appointmentsDoctor,
    appointmentComplete,
    appointmentCancel,
    doctorDashboard,
    doctorProfile,
updateDoctorProfile
}