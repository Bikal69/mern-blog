import React from 'react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import {app} from '../firebase.js'
import { Button } from 'flowbite-react'
import { useDispatch } from 'react-redux'
import { SignInSuccess } from '../redux/User/userSlice.js';
import { useNavigate } from 'react-router-dom'
export default function OAuth() {
  const dispatch=useDispatch();
  const navigate=useNavigate()
  const auth=getAuth(app)
    const handleGoogleClick=async()=>{
const provider=new GoogleAuthProvider();
provider.setCustomParameters({prompt:'select_account'});
try{
  const resultsFromGoogle=await signInWithPopup(auth,provider);
const res=await fetch('/api/auth/google',{
  method:'POST',
  headers:{'Content-Type':'application/json'},
  body:JSON.stringify({
    name:resultsFromGoogle.user.displayName,
    email:resultsFromGoogle.user.email,
    googlePhotoUrl:resultsFromGoogle.user.photoURL,
  }),
})
const data=await res.json()
if(res.ok){
  dispatch(SignInSuccess(data))
  navigate('/')
}
}catch(error){
  console.log(error);
}
    }
  return (
    <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={handleGoogleClick}>
        <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
        Continue with Google
    </Button>
  )
}
