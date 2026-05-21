import React from 'react'
import { useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'

const DoctorAppointment = () => {
  const {getAppointments,appointments,dToken} = useContext(DoctorContext);
  useEffect(()=>{
     if(dToken){
       getAppointments();
     }
  },[dToken]);
  return (
    <div className='w-full max-w-6xl m-5'>
       <p className='mb-3 text-lg font-medium'>All Appointments</p>
       <div className='bg-white border rounded text-sm maxh-[80vh] min-h-[50vh] '>
        <div>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
       </div>
    </div>
  )
}

export default DoctorAppointment
