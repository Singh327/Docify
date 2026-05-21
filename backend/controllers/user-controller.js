
import validator from 'validator'
import bcrypt from 'bcrypt'

 // controllers for Login ,register, getProfile, upDate Profile, book Appointment , diaply appointments, cancel appointment , paymnet gateway
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import userModel from '../models/userModel.js';
import appointmentModel from '../models/appointmentModel.js';
import razorpay from 'razorpay'

// Api to register user 
const registerUser = async(req,res)=>{
    try{
        const {name,password,email} = req.body;
        if(!name || !email || !password){
            return res.json({
                success:false,
                message : "Missing Details"
            })
        }
        //validating email format
        if(!validator.isEmail(email)){
             return res.json({
                success:false,
                message : "Enter a valid email"
             })
        }
        // validating strong password
        if(password.length <8 ){
             return res.json({
                success:false,
                message : "Enter a string password"
             })
        }

        // Hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const userData = {
            name,email,
            password : hashedPassword
        }
        const newUser = new userModel(userData);
        const user = await newUser.save();
        

        // creating token 
        
        const token = jwt.sign({
            id :user._id
        },process.env.JWT_SECRET);
        res.json({
            success:true,
            token
           
        })
    }
    catch(e){
        console.log(e);
        res.json({
            success:false,
            message : e.message
        })
    }
}

// API for user Login
const loginUser = async(req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({
                success:false,
                message :'User does not exist'
            })
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.json({
                success:false,
                message : "Wrong Password Provided"
            })
        }

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET);

        res.json({success:true,
            token
        })
    }
    
    catch(e){
        console.log(e);
        res.json({
            success:false,
            message : e.message
        })
    }
}


// API to get user profile data
const getProfile = async(req,res)=>{
    try{
       const {id} = req.user;
       const userData = await userModel.findById(id).select('-password');
       if(!userData){
         return res.json({
            success:false,
            message : "User not found"
         })
       }
       res.json({
        success:true,
        userData
       })
    }
    catch(e){
        console.log(e);
        res.json({
            success:false,
            message : e.message
        })
    }
}


// Api to update user profile
const updateProfile = async(req,res)=>{
   try{
      const {name,phone,address,dob,gender} = req.body;
      const id = req.user.id;
      const imageFile = req.file;
       console.log(name,dob,phone,gender);
      if(!name  || !phone  || !dob || !gender){
        return res.json({
            success:false,
            message : "Missing Data"
        })
      }
     
      let userData = await userModel.findByIdAndUpdate(id,{name,phone,address:JSON.parse(address),dob,gender});
      if(imageFile){
         // Upload image to cloudinary

         const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'});
         
         const imageUrl = imageUpload.secure_url;
          userData = await userModel.findByIdAndUpdate(id,{image:imageUrl});

      }
      console.log(userData);

      res.json({
        success:true,
        message : "Profile Updated",
        userData
      })
   }
   catch(e){
       console.log(e);
        res.json({
            success:false,
            message : e.message
        })
   }
}

// API to book appointment
const bookAppointment = async(req,res)=>{
    try{
      const userId  = req.user.id;
      const {docId,slotDate,slotTime} = req.body;
      const docData = await doctorModel.findById(docId).select('-password');
      if(!docData.available){
         return res.json({
            success:false,
            message  : "Doctor not available"
         })
      }
      let slots_booked = docData.slots_booked;
      // Checking for slots availabitlity
      if(slots_booked[slotDate]){
         if(slots_booked[slotDate].includes(slotTime)){
              return res.json({
            success:false,
            message  : "Slot not available"
         })
         }
         else{
            slots_booked[slotDate].push(slotTime);
         }
      }
      else{
         slots_booked[slotDate] = [];
         slots_booked[slotDate].push(slotTime);
      }
      console.log(slots_booked);
      const userData = await userModel.findById(userId).select('-password');
      delete docData.slots_booked;

      const appointmentData = {
        userId,
        docId,
        userData,
        docData,
        amount  : docData.fees,
        slotTime,
        slotDate,
        date : Date.now()
      }
      const newAppointment = new appointmentModel(appointmentData);
      await newAppointment.save();
       
      // Save new slots data in doctor dataa
      await doctorModel.findByIdAndUpdate(docId,{slots_booked});
       
      

      res.json({
        success:true,
        message: "Appointment created successfully"
      })
    }
    catch(e){
        console.log(e);
        res.json({
            success:false,
            message : e.message
        }) 
    }
}
// API to get user apppintments for frontend my-appointments page
const getAllAppointments = async(req,res)=>{
    try{
        const userId = req.user.id;
       const appointments = await appointmentModel.find({userId});
       
       res.json({
        success:true,
        appointments
       })
    }
    catch(e){
        console.log(e);
        res.json({
            success:false,
            message : e.message
        }) 
    }
}


// API to cancel appointment

const cancelAppointment  = async(req,res)=>{
   try{
     const userId = req.user.id;
     const {appointmentId} = req.body;
     const appointmentData = await appointmentModel.findById(appointmentId);


     // verify appointment user
     if(appointmentData.userId !== userId){
        return res.json({
            success:false,
            message : "Unauthorized action"
        })
     }
     await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled : true});
  
      // Releasing doctor slot
      const {docId,slotDate,slotTime} = appointmentData;
       const docData = await doctorModel.findById(docId);
       let slots_booked = docData.slots_booked;
       slots_booked[slotDate] = slots_booked[slotDate].filter(time=> time!==slotTime);
       await doctorModel.findByIdAndUpdate(docId,{slots_booked});
     res.json({
        success : true,
        message : "Appointment cancelled"
     })
   }
   catch(e){
     console.log(e);
        res.json({
            success:false,
            message : e.message
        }) 
   }
}

const razorpayInstance = new razorpay({
    key_id : process.env.RAZORPAY_KEY_ID,
    key_secret : process.env.RAZORPAY_KEY_SECRET
})

// API to make payment of appointment using razorpay

const paymentRazorpay = async(req,res)=>{
    try{
        const {appointmentId} = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
     
    if(!appointmentData || appointmentData.cancelled){
        return res.json({
            success:false,
            message : "Appointment cancelled or not found"
        })
    }

    // Creating options for razorpay payment
    const options = {
        amount : appointmentData.amount * 100,
        currency : process.env.CURRENCY,
        receipt : appointmentId,
        
    }
    // Using options , creating order on razorpay
    const order = await razorpayInstance.orders.create(options);
    res.json({
        success:true,
        order
    })
    }
   catch(e){
      console.log(e);
        res.json({
            success:false,
            message : e.message
        }) 
   }
}
   
// API to verify payment of razorpay

const verifyRazorpay = async(req,res)=>{
   try{
     const {razorpay_order_id} = req.body;
     const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
     if(orderInfo.status === 'paid'){
        await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true});
        res.json({
            success
            :true,
            message : "Payment successful"
        })
     }
     else{
        return res.json({
            success:false,
            message : "Payment failed"
        })
     }

   }
   catch(e){
      console.log(e);
        res.json({
            success:false,
            message : e.message
        }) 
   }
}

export {registerUser,loginUser,getProfile,updateProfile,bookAppointment,getAllAppointments,cancelAppointment,paymentRazorpay,verifyRazorpay};
