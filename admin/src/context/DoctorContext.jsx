import { createContext, useState } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'
export const DoctorContext = createContext();

const DoctorContextProvider = (props)=>{
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [dToken,setDToken] = useState(localStorage.getItem('dToken')? localStorage.getItem('dToken'): '');
  const [appointments,setAppointments] = useState([]);
  const [dashData,setDashData] = useState(false);
  const [profileData,setProfileData] = useState(false);
  const getAppointments = async()=>{
    try{
      const {data} = await axios.get(backendUrl + '/api/doctor/appointments',
        {
          headers : {dToken}
        }
      )
      if(data.success){
         setAppointments(data.appointments);
      }
      else{
        toast.error(data.message);
      }
    }
    catch(e){
      console.log(e);
      toast.error(e.message);
    }
  }

   const completeAppointment = async(appointmentId)=>{
    try{
      const {data} = await axios.post(backendUrl + '/api/doctor/appointment-complete',
        {appointmentId},
        {
        headers : {dToken}
      })
      if(data.success){
        toast.success(data.message);
        getAppointments();
        getDashData();
      }
      else{
        toast.error(data.message);
      }
    }
    catch(e){
      console.log(e);
      toast.error(e.message);
    }
   }

    const cancelAppointment = async(appointmentId)=>{
    try{
      const {data} = await axios.post(backendUrl + '/api/doctor/appointment-cancel',
        {appointmentId},
        {
        headers : {dToken}
      })
      if(data.success){
        toast.success(data.message);
        getAppointments();
         getDashData();
      }
      else{
        toast.error(data.message);
      }
    }
    catch(e){
      console.log(e);
      toast.error(e.message);
    }
   }

   const getDashData = async()=>{
    try{
      const {data} = await axios.get(backendUrl + '/api/doctor/dashboard',
        {
          headers : {dToken}
        }
      );
      if(data.success){
        console.log(data)
        setDashData(data.dashData);
        
      }
      else {
        toast.error(data.message);
      }
      
    }
    catch(e){
      console.log(e);
      toast.error(e.message);
    }
   }

   const getProfileData = async()=>{
    try{
      const {data} = await axios.get(backendUrl + '/api/doctor/profile',{
        headers : {dToken}
      });
      if(data.success){
        
        setProfileData(data.profileData)
      }
      else{
        toast.error(data.message);
      }
    }
    catch(e){
      console.log(e);
      toast.error(e.message);
    }
   } 

   const value = {
    dToken,setDToken,backendUrl,appointments,getAppointments,setAppointments,completeAppointment,cancelAppointment,getDashData,dashData,profileData,getProfileData,setProfileData

   }
   return (
     <DoctorContext.Provider value = {value}>
       {props.children}
     </DoctorContext.Provider>
   )
}
export default DoctorContextProvider;