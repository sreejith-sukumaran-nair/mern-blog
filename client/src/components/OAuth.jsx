import { Button } from 'flowbite-react';
import React from 'react'
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from 'react-redux';
import { GoogleAuthProvider, signInWithPopup , getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { signInFailure, signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';


function OAuth() {
  const auth = getAuth(app)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async() => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt : "select_account"})
    try {
      const resultFromGoogle = await signInWithPopup(auth,provider);
      const res = await fetch('/api/auth/google' , {
        method : "POST" ,
        headers : {
          'Content-Type' : 'application/json'
        } ,
        body : JSON.stringify({
          name : resultFromGoogle.user.displayName ,
          email : resultFromGoogle.user.email ,
          googlePhotoURL : resultFromGoogle.user.photoURL
        })
      });
      const data = await res.json();
      if(res.ok){
        dispatch(signInSuccess(data))
        navigate('/')
      }
      if(data.success === false){
        dispatch(signInFailure(data.message))
      }
    } catch (error) {
      dispatch(signInFailure(error))
    }
  }
  return (
    <Button onClick={handleGoogleClick} type='button' outline gradientDuoTone={"pinkToOrange"}>
      <FcGoogle className='text-xl mr-2' /><span>Continue with Google</span>
    </Button>
  )
}

export default OAuth;