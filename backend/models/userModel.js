import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
     name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image : {
        type : String,
        default : "https://res.cloudinary.com/do1a3aqfn/image/upload/v1778916656/rz21wpikjjgzm9icefnc.png"
    },
    address : {
        type : Object,
        default : {
            line1 : "Not Provided",
            line2 : "Not provided"
        }
    },
    gender : {
        type : String,
        default : 'Not Selected'
    },
   
      dob : {
        type : String,
        default : 'Not Selected'
    },
    phone : {
        type : String,
        default : '00000000'
    }
});

const userModel = mongoose.models.user || mongoose.model('user',userSchema);

export default userModel;