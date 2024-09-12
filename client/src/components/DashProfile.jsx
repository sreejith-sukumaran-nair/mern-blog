import { Button, Label, TextInput } from 'flowbite-react'
import React from 'react'
import { useSelector } from 'react-redux'

function DashProfile() {
  const {currentUser} = useSelector((state) => state.user)
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center text-3xl font-extralight'>
        Profile
      </h1>
      <form className='flex flex-col'>
        <div className="w-28 h-28 self-center">
          <img className='cursor-pointer shadow-md object-cover rounded-full w-full h-full border-2 border-[lightgray]' src={currentUser.profilePicture} alt="profilePic" />
        </div>
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
      <div className="text-red-500 flex justify-between mt-5">
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign out</span>
      </div>
    </div>
  )
}

export default DashProfile