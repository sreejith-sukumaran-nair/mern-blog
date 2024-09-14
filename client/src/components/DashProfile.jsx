import { Alert, Button, Label, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { app } from '../firebase';

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';

function DashProfile() {
  const {currentUser} = useSelector((state) => state.user);
  const [imageFile,setImageFile] = useState(null);
  const [imageFileURL,setImageFileURL] = useState(null);
  const [imageFileUploadProgress , setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError,setImageFileUploadError] = useState(null)
  const filePickerRef = useRef()
  const [imageFileUploading, setImageFileUploading] = useState(false);
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(file){
      setImageFile(file);
      setImageFileURL(URL.createObjectURL(file))
    }
    
  }
  useEffect(() => {
    if(imageFile){
      uploadImage()
    }
  },[imageFile]);

  const uploadImage = async() => {
    setImageFileUploadError(null)
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    
    uploadTask.on('state_changed' , 
      (snapshot) => {
        const progress = 
        (snapshot.bytesTransferred / snapshot.totalBytes )*100;
        setImageFileUploadProgress(progress.toFixed(0))
      } ,
      (error) => {
        setImageFileUploadError(
          'Could not upload image (File must be less than 2MB)'
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileURL(null);
        setImageFileUploading(false);
      } , 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadedURL) => setImageFileURL(downloadedURL))
       
      }
    )
  }

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center text-3xl font-extralight'>
        Profile
      </h1>
      <form className='flex flex-col'>
        <input hidden ref={filePickerRef } type="file" accept='image/*' onChange={handleImageChange}/>
        <div className="relative w-28 h-28 self-center" onClick={() => filePickerRef.current.click()}>
          {imageFileUploadProgress &&  <CircularProgressbar value={imageFileUploadProgress || 0} text = {`${imageFileUploadProgress}%`} strokeWidth={3}
          styles={{
            root : {
              'width' : '100%' ,
              'height' : '100%' ,
              'position' : 'absolute',
              'top' : '0' ,
              'bottom' : '0' ,
            },
            path : {
              stroke : `rgba(100,255,100, ${imageFileUploadProgress/100})`
            }
          }}
          /> }
          <img className={`rounded-full w-full h-full object-cover border-4 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              'opacity-60'
            }`} src={imageFileURL || currentUser.profilePicture} alt="profilePic" />
         
        </div>
        {imageFileUploadError &&  
        <Alert color='failure' className='mt-3' >
          {imageFileUploadError}
        </Alert>
        }
        
        <div>
        <div className="mb-2 block ml-[1000px]">
          <Label htmlFor="username" value="Username" />
        </div>
        <TextInput id="username" type="text" placeholder="Your username" defaultValue={currentUser.username} />
      </div>
        <div>
        <div className="mb-2 block ml-[1000px]">
          <Label htmlFor="email" value="Email" />
        </div>
        <TextInput id="email" type="email" placeholder="Your email" defaultValue={currentUser.email} />
      </div>
        <div>
        <div className="mb-2 block ml-[1000px]">
          <Label htmlFor="password" value="password" />
        </div>
        <TextInput id="password" type="text" placeholder="Your password" />
      </div>
      <Button className='mt-8' type="submit" gradientDuoTone={'purpleToBlue'} outline >Update</Button>
      </form>
      <div className="text-red-500 flex justify-between my-5">
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign out</span>
      </div>
    </div>
  )
}

export default DashProfile