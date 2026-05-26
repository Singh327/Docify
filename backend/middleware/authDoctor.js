
import jwt from 'jsonwebtoken'

// Dcotor authentication middlware
const authDoctor = async(req,res,next)=>{

    try{
         const {dtoken} = req.headers;
    if(!dtoken){
        return res.json({
            success:false,
            message : "Not authorised, login again"
        })
    }
    const decoded = jwt.verify(dtoken,process.env.JWT_SECRET);
     req.user = decoded;
    next();
    }
    catch(e){
        console.log(e);
        res.json({
            success:false,
            message : e.message
        })
    }
   
}
export default authDoctor;