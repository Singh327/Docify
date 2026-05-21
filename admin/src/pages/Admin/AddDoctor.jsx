import React, { useState,useContext } from 'react'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify';
import { AdminContext } from '../../context/adminContext';
const AddDoctor = () => {
   const [docImg,setDocImg] = useState(false);
   const [name,setName] = useState('');
   const [email,setEmail] = useState('');
   const [password,setPassword] = useState('');
   const [experience,setExperience] = useState('1 Year');
   const [fee,setFee] = useState('');
   const [about,setAbout] = useState('');
   const [speciality,setSpeciality] = useState('General Physician');
   const [degree,setDegree] = useState('');
  const [address1,setAddress1] = useState('')
   const [address2,setAddess2] = useState('');
                    
  
        const {backendUrl,aToken} = useContext(AdminContext);
    const onSubmitHandler = async(event)=>{
       event.preventDefault();
       try{
         if(!docImg){
          return toast.error("Image not selected");
         }
         const formData = new FormData();
        formData.append('image',docImg);
        formData.append('name',name);
        formData.append('email',email);
        formData.append('password',password);
        formData.append('experience',experience);
        formData.append('fees',Number(fee));
        formData.append('about',about);
        formData.append('speciality',speciality);
        formData.append('degree',degree);
        formData.append('address',JSON.stringify({line1:address1,line2:address2}));
   

        // console log form data
     

       const {data} = await axios.post(backendUrl + '/api/admin/add-doctor',formData,{
           headers : {aToken}
       })
        if(data.success){
          toast.success(data.message);
          setDocImg(false);
          setName('');
          setPassword('');
          setEmail('');
          setAddress1('');
          setAddess2('');
          setAbout('');
          setDegree('');
          setFee('');
        }
        else {
          toast.error(data.message);
        }
       }
      catch(e){
      toast.error(e.message);
      console.log(e);
      }
    }

  return (
    <form onSubmit={onSubmitHandler} className='m-5 w-full'>
      <p className='mb-3 text-lg font-medium'>Add Doctor</p>

      <div  className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll' >
        <div className='flex  items-center gap-4 mb-8 text-gray-500' >
          <label htmlFor="doc-img">
            <img  className = 'w-16 bg-gray-100 rounded-full cursor-pointer' src={docImg ? URL.createObjectURL(docImg) :assets.upload_area} alt="" />
          </label>
          <input onChange={(e)=>setDocImg(e.target.files[0])} type="file" id="doc-img" hidden/>
          <p>Upload Doctor <br/> picture</p>
        </div>
        <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600 ' >
          <div className=' w-full lg:flex-1 flex flex-col gap-4' >
             
             <div className='flex flex-1 flex-col gap-1'>
               <p>Doctor name</p>
               <input className='border rounded  py-2 px-3 ' type="text" placeholder='Name' value={name} onChange={(e)=>setName(e.target.value)} required />
             </div>
              <div  className='flex flex-1 flex-col gap-1'>
               <p>Doctor Email</p>
               <input value={email} onChange={(e)=>setEmail(e.target.value)}  className='border rounded  py-2 px-3 ' type="email" placeholder='Email' required />
             </div>
              <div  className='flex flex-1 flex-col gap-1'>
               <p>Doctor Password</p>
               <input value={password} onChange={(e)=>setPassword(e.target.value)} className='border rounded  py-2 px-3 ' type="password" placeholder='Password' required />
             </div>
              <div  className='flex flex-1 flex-col gap-1'>
                <p>Experience</p>
                <select value={experience} onChange={(e)=>setExperience(e.target.value)} className='border rounded  py-2 px-3 ' name="" id="">
                  <option value="1 Year">1 Year</option>
                  <option value="2 Year">2 Year</option>
                  <option value="3 Year">3 Year</option>
                  <option value="4 Year">4 Year</option>
                  <option value="5 Year">5 Year</option>
                  <option value="6 Year">6 Year</option>
                  <option value="7 Year">7 Year</option>
                  <option value="8 Year">8 Year</option>
                  <option value="9 Year">9 Year</option>
                  <option value="10 Year">10 Year</option>
                </select>
              </div>
               <div  className='flex flex-1 flex-col gap-1'>
               <p>Fees</p>
               <input value={fee} onChange={(e)=>setFee(e.target.value)} className='border rounded  py-2 px-3 ' type="number" placeholder='Fee' required />
             </div>
          </div>
          {/* right part of the form  */}
          <div className=' w-full lg:flex-1 flex flex-col gap-4' >
              <div  className='flex flex-1 flex-col gap-1'>
                <p>Speciality</p>
                <select value={speciality} onChange={(e)=>setSpeciality(e.target.value)} className='border rounded  py-2 px-3 ' name="" id="">
                  <option value="General Physician">General Physician</option>
                  <option value="Gynecologist">Gynecologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Pediatrician">Pediatrician</option>
                  <option value="Neurologist">Neurologist</option>
                  <option value="Gastroenterologist">Gastroenterologist</option>
                </select>
              </div>

              <div  className='flex flex-1 flex-col gap-1'>
                <p>Education</p>
                <input value={degree} onChange={(e)=>setDegree(e.target.value)}  className='border rounded  py-2 px-3 ' type="text" placeholder='Education'  required/>
              </div>

              <div  className='flex flex-1 flex-col gap-1'>
                <p>Address</p>
                <input value={address1} onChange={(e)=>setAddress1(e.target.value)}  className='border rounded  py-2 px-3 ' type="text" placeholder='Address 1' required />
                 <input value={address2} onChange={(e)=>setAddess2(e.target.value)}  className='border rounded  py-2 px-3 ' type="text" placeholder='Address 2' required />
              </div>
          </div>
        </div>
           <div>
                <p className='mt-4 mb-2'>About Doctor</p>
                <textarea value={about} onChange={(e)=>setAbout(e.target.value)}  className='w-full px-4 border rounded' placeholder='Write about Doctor' rows={5}  required/>
              </div>
        <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>Add Doctor</button>
      </div>
    </form>
  )
}

export default AddDoctor
