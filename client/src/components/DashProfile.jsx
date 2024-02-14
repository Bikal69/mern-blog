import { TextInput,Button, Alert } from 'flowbite-react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import React, { useEffect, useRef, useState } from 'react'
import {useSelector} from 'react-redux'
import { app } from '../firebase';
import {CircularProgressbar} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css' 
export default function DashProfile() {
    const {currentUser}=useSelector(state=>state.user)
    const [imageFile,setImageFile]=useState(null);
    const [imageFileUrl,setImageFileUrl]=useState(null);
    const [imageFileUploadProgress,setImageFileUploadProgress]=useState(null);
    const filePickerRef=useRef();
    const [imageFileUploadError,setImageFileUploadError]=useState(null);
    const handleImageChange=(e)=>{
      const file=e.target.files[0];
      if(file){
        setImageFile(file)
        setImageFileUrl(URL.createObjectURL(file));
      }
    }
useEffect(()=>{
  if(imageFile){
    uploadImage();
  }
},[imageFile])
const uploadImage=async()=>{
  const storage=getStorage(app);
  const fileName=new Date().getTime()+imageFile.name;
  const storageRef=ref(storage,fileName);
  const uploadTask=uploadBytesResumable(storageRef,imageFile);
  // uploadBytesResumable() is a Firebase Storage function that initiates a resumable file upload. Resumable uploads are ideal for larger files or unreliable network connections because they can be paused and resumed if interruptions occur.
  uploadTask.on('state_changed',(snapshot)=>{
    setImageFileUploadError(null)
    const progress=(snapshot.bytesTransferred / snapshot.totalBytes)*100;//this code is calculating progress of upload
    // The snapshot parameter is an object provided by Firebase containing information about the current state of the upload.
    setImageFileUploadProgress(progress.toFixed(0));//toFixed method takes 0 number after decimal i.e no decimal numbers
  },(error)=>{
setImageFileUploadError('could not upload image (file must be less than 2 MB');
setImageFileUploadProgress(null);
setImageFile(null);
setImageFileUrl(null);
  },()=>{
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
      setImageFileUrl(downloadURL);
    });
    //here we used snapshot.ref instead of snapshot because snapshot contains the uploaded data along with metadata but the snapshot.ref refrences the location of data in firebase storage.
  })
}
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl'>profile</h1>
        <form className='flex flex-col gap-4'>
          
          <input type="file" accept='image/*'ref={filePickerRef} onChange={handleImageChange} />
            <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={()=>filePickerRef.current.click()}>
              {imageFileUploadProgress && (
                <CircularProgressbar value={imageFileUploadProgress || 0} text={`${imageFileUploadProgress}%`} strokeWidth={5} styles={{
                  root:{
                    width:'100%',
                    height:'100%',
                    position:'absolute',
                    top:0,
                    left:0,
                  },
                  path:{
                    stroke:`rgba(62,152,199,${imageFileUploadProgress/100})`,
                  }
                }}/>
              )}
            <img src={imageFileUrl ||currentUser?.profilePicture} alt="user" className={`rounded-full w-full h-full object-cover border-8 border-[hsl(0,0%,83%)] ${imageFileUploadProgress && imageFileUploadProgress<100 && 'opacity-60'}`} />
            </div>
            {
              imageFileUploadError && (
              <Alert color='failure'>
              {imageFileUploadError}
            </Alert>
              )
            }
            
           <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser?.username}/>
           <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser?.email}/>
           <TextInput type='password' id='password' placeholder='password'/>
           <Button type='submit' gradientDuoTone='purpleToBlue' outline>
            Update
           </Button>
        </form>
        <div className="text-red-500 flex justify-between mt-5">
          <span className=' cursor-pointer'>Delete Account</span>
          <span className=' cursor-pointer'>Sign Out</span>
        </div>
    </div>
  )
}
