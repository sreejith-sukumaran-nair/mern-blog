import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link , useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

function SignUp() {
  const [formData,setFormData] = useState({});
  const [errorMessage,setErrorMessage] = useState(null);
  const [loading,setLoading] = useState(false);
  const naviagate = useNavigate()

  const handleChange = (e) => {
    setFormData({...formData , [e.target.id] : e.target.value.trim()})
  }
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    if(!formData.username || !formData.password || !formData.email){
      return setErrorMessage('Please fill out all the fields...')
    }
    try {
      setLoading(true);
      setErrorMessage("")
      const res = await fetch('/api/auth/signup', {
        method : "POST" ,
        headers : {
          'Content-Type' : "application/json"
        },
        body : JSON.stringify(formData)
      });
      const data = await res.json();
      if(data.success === false){
        setErrorMessage(data.message)
        setLoading(false)
      }
      setLoading(false)
      if(res.ok){
        naviagate('/sign-in');
      }
    } catch (error) {
      setErrorMessage(error.message)
      setLoading(false)
    }
    
  }

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left div */}
        <div className="flex-1">
          <Link
            to={"/"}
            className="self-center whitespace-nowrap text-4xl dark:text-white"
          >
            <span className="px-2 py-1 rounded-lg text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Puli
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            This is a demo project, You can sign up with email and password or with google
          </p>
        </div>
        {/* right div */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your user name"/>
              <TextInput 
                type="text"
                placeholder="username"
                id="username"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your email"/>
              <TextInput 
                type="email"
                placeholder="yourname@gmail.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Password"/>
              <TextInput 
                type="password"
                placeholder="password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button disabled = {loading} className="mt-3" gradientDuoTone={'purpleToPink'} type="submit"> 
              {loading ? 
              <>
              <Spinner size={"sm"}></Spinner>
              <span className="mx-2">loading...</span>
              </>
              
              : "Sign Up" }
            </Button>
            <OAuth/>
          </form>
          
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account ? </span>
            <Link to={'/sign-in'} className="text-blue-500">
              Sign In
            </Link>
          </div>
          {
            errorMessage && 
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          }
        </div>
      </div>
    </div>
  );
}

export default SignUp;
