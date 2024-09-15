import { Alert, Button, Label, Modal, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRef } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';

import { app } from "../firebase";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import {
  updateFailure,
  updateStart,
  updateSuccess,
  deleteUserSuccess ,
  deleteUserFailure , 
  deleteUserStart,
  signoutSuccess
} from "../redux/user/userSlice";

function DashProfile() {
  const { currentUser , error ,loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileURL, setImageFileURL] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const filePickerRef = useRef();
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileURL(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileURL(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadedURL) => {
          setImageFileURL(downloadedURL);
          setFormData({ ...formData, profilePicture: downloadedURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError("Please wait untill imgage has been uploaded");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        localStorage.setItem(
          "currentUserInLoacalStorage",
          JSON.stringify(data)
        );
        setUpdateUserSuccess("User data updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(data.message));
      setUpdateUserError(data.message);
    }
  };

  const handleDelete = async() => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method : 'DELETE'
      });
      const data = await res.json();
      if(!res.ok){
        dispatch(deleteUserFailure(data.message))
      }
      else{
        localStorage.removeItem("currentUserInLoacalStorage");
        dispatch(deleteUserSuccess())
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignout = async() => {
    try {
      const res = await fetch('/api/user/signout' , {
        method : 'POST' ,
      });
      const data = await res.json();
      if(!res.ok){
        console.log(data.message)
      }else{
        dispatch(signoutSuccess())
        localStorage.removeItem('currentUserInLoacalStorage')
      }

    } catch (error) {
      console.log(error.message)
      
    }
  }

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center text-3xl font-extralight">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          hidden
          ref={filePickerRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <div
          className="relative w-28 h-28 self-center"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={3}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: "0",
                  bottom: "0",
                },
                path: {
                  stroke: `rgba(100,255,100, ${imageFileUploadProgress / 100})`,
                },
              }}
            />
          )}
          <img
            className={`rounded-full w-full h-full object-cover border-4 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
            src={imageFileURL || currentUser.profilePicture}
            alt="profilePic"
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure" className="mt-3">
            {imageFileUploadError}
          </Alert>
        )}

        <div>
          <div className="mb-2 block ml-[1000px]">
            <Label htmlFor="username" value="Username" />
          </div>
          <TextInput
            id="username"
            type="text"
            placeholder="Your username"
            defaultValue={currentUser.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <div className="mb-2 block ml-[1000px]">
            <Label htmlFor="email" value="Email" />
          </div>
          <TextInput
            id="email"
            type="email"
            placeholder="Your email"
            defaultValue={currentUser.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <div className="mb-2 block ml-[1000px]">
            <Label htmlFor="password" value="password" />
          </div>
          <TextInput
            id="password"
            type="text"
            placeholder="Your password"
            onChange={handleChange}
          />
        </div>
        <Button
          className="mt-8"
          type="submit"
          gradientDuoTone={"purpleToBlue"}
          outline
          disabled = {loading || imageFileUploading}
        >
          {loading ? 'loading...' : 'Update'}
        </Button>
        {
          currentUser.isAdmin && 
          <>
          <Link to={'/create-post'}>
          <Button
          className="mt-8 w-full"
          type="button"
          gradientDuoTone={"purpleToPink"}
          outline
        >
          Create a post
        </Button>
          </Link>
          </>
        }
      </form>
      <div className="text-red-500 flex justify-between my-5">
        <span onClick={() => setShowModal(true)} className="cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignout} className="cursor-pointer">Sign out</span>
      </div>
      {updateUserSuccess && (
        <Alert color="success" className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color="failure" className="mt-5">
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}
      {showModal && (
        <Modal
          show={showModal}
          size="md"
          onClose={() => setShowModal(false)}
          popup
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete your account?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleDelete}>
                  {"Yes, I'm sure"}
                </Button>
                <Button color="gray" onClick={() => setShowModal(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}

export default DashProfile;
