import mongoose from "mongoose";

const connectDB = async()=>{
    mongoose.connection.on('connected',()=>console.log("DataBase connected Successfully"))
    await mongoose.connect(`${process.env.MONGODB_URI}/docify`)
}

export default connectDB;