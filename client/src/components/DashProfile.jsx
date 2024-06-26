import { TextInput,Button, Alert, Modal,Spinner } from 'flowbite-react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import React, { useEffect, useRef, useState } from 'react'
import {HiOutlineExclamationCircle} from 'react-icons/hi'
import {useDispatch, useSelector} from 'react-redux'
import { app } from '../firebase';
import {CircularProgressbar} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css' 
import { updateStart,updateFailure,updateSuccess,deleteUserFailure,deleteUserStart,deleteUserSuccess,signOutSuccess,signOutFailure} from '../redux/User/userSlice.js';
import { Link, useNavigate } from 'react-router-dom'
import useAuthentication from '../context/AuthenticationContext.js'
export default function DashProfile() {
  const navigate=useNavigate();
    const {currentUser,error,loading}=useSelector(state=>state.user)
    const [imageFile,setImageFile]=useState(null);
    const [imageFileUrl,setImageFileUrl]=useState(null);
    const [imageFileUploading,setImageFileUploading]=useState(false);
    const [updateUserSuccess,setUpdateUserSuccess]=useState(null);
    const [updateUserError,setUpdateUserError]=useState(null);
    const [showModal,setShowModal]=useState(false);
    const [imageFileUploadProgress,setImageFileUploadProgress]=useState(null);
    const filePickerRef=useRef();
    const [imageFileUploadError,setImageFileUploadError]=useState(null);
    const [formData,setFormData]=useState({});
    const dispatch=useDispatch()
    const handleImageChange=(e)=>{
      const file=e.target.files[0];
      if(file){
        setImageFile(file)
        setImageFileUrl(URL.createObjectURL(file));
      }
    }
    const {checkAuthentication}=useAuthentication();
useEffect(()=>{
  if(imageFile){
    uploadImage();
  }
  checkAuthentication();
},[imageFile])
const uploadImage=async()=>{
  setImageFileUploading(true);
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
setImageFileUploading(false);
  },()=>{
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
      setImageFileUrl(downloadURL);
      setFormData({...formData,profilePicture:downloadURL});
      setImageFileUploading(false);
    });
    //here we used snapshot.ref instead of snapshot because snapshot contains the uploaded data along with metadata but the snapshot.ref refrences the location of data in firebase storage.
  })
}
const handleChange=(e)=>{
  setFormData({...formData,[e.target.id]:e.target.value})
}
const handleSubmit=async(e)=>{
  e.preventDefault();
  setUpdateUserError(null);
  setUpdateUserSuccess(null)
  if(Object.keys(formData).length===0){
    setUpdateUserError('No changes made')
    return;
  }
  try{
dispatch(updateStart());
const res=await fetch(`/api/user/update/${currentUser?._id}`,{
  method:'PUT',
  headers:{
    'Content-Type':'application/json',
  },
  body:JSON.stringify(formData)
});
const data=await res.json();
//if user is unauthorized then logout user(in the case when cookie expires and user tries to modify profile)
if(res.status===401){
handleSignOut();
  navigate('/sign-in');

}
if(!res.ok){
    dispatch(updateFailure(data.message));
    setUpdateUserError(data.message);
}else{
  dispatch(updateSuccess(data));
  setUpdateUserSuccess("user's profile updated successfully");
}
  }
  catch(error){
dispatch(updateFailure(error.message));
setUpdateUserError(error.message);
  }
}
//delete user function
const handleDeleteUser=async()=>{
setShowModal(false);
try{
dispatch(deleteUserStart);
const res=await fetch(`/api/user/delete/${currentUser?._id}`,{
  method:'DELETE',
});
const data=await res.json();
if(!res.ok){
  dispatch(deleteUserFailure(data.message));
}else{
  dispatch(deleteUserSuccess(data));
}
}catch(error){
dispatch(deleteUserFailure(error.message))
}
}
const handleSignOut=async()=>{
  setShowModal(true);
  try{
    const res=await fetch('/api/user/signout',{
      method:'POST',
    });
    const data=await res.json();
    if(!res.ok){
      console.log(data.message);
    }else{
      dispatch(signOutSuccess());
    }
  }catch(error){
  dispatch(signOutFailure(error))
  }
}
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl'>profile</h1>
        <form onSubmit={handleSubmit}className='flex flex-col gap-4'>
          
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
            
           <TextInput onChange={handleChange} type='text' id='username' placeholder='username' defaultValue={currentUser?.username}/>
           <TextInput  onChange={handleChange}type='email' id='email' placeholder='email' defaultValue={currentUser?.email}/>
           <TextInput  onChange={handleChange}type='password' id='password' placeholder='password'/>
           <Button type='submit' gradientDuoTone='purpleToBlue' outline disabled={loading||imageFileUploading}>
            {
              loading?(
                <>
                <Spinner size='sm'/>
                <span>Loading...</span>
                </>
              ):'Update'
            }
           </Button>
           {
            currentUser?.isAdmin && (
              <Link to={'/create-post'}>
                <Button type='button' gradientDuoTone='purpleToPink' className='w-full' >
                Create a post
              </Button>
              </Link>
              
            )
           }
        </form>
        <div className="text-red-500 flex justify-between mt-5">
          <span className=' cursor-pointer' onClick={()=>setShowModal(true)}>Delete Account</span>
          <span className=' cursor-pointer' onClick={()=>setShowModal(true)}>Sign Out</span>
        </div>
        {
          updateUserSuccess&&<Alert color='success' className='mt-5'>
            {updateUserSuccess}
          </Alert>
        }
          {
          updateUserError&&<Alert color='failure' className='mt-5'>
            {updateUserError}
          </Alert>
        } {
          error&&<Alert color='failure' className='mt-5'>
            {error}
          </Alert>
        }
        <Modal show={showModal} onClose={()=>setShowModal(false)} popup size='md'>
          <Modal.Header/>
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
              <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete your account?</h3>
              <div className="flex justify-center gap-4">
                <Button color='failure' onClick={handleDeleteUser}>
                  Yes I am sure
                </Button>
                <Button color='gray' onClick={()=>setShowModal(false)}>
                  No,cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
          </Modal>
          <Modal show={showModal} onClose={()=>setShowModal(false)} popup size='md'>
          <Modal.Header/>
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
              <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to signout your account?</h3>
              <div className="flex justify-center gap-4">
                <Button color='failure' onClick={handleSignOut}>
                  Yes I am sure
                </Button>
                <Button color='gray' onClick={()=>setShowModal(false)}>
                  No,cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
          </Modal>
    </div>
  )
      }
