import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function CreatePost() {
  const [imageFile, setImageFile] = useState(null);
  const [imagFileUploadProgress,setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError , setImageFileUploadError] = useState(null);
  const [imageFileURL,setImageFileURL] = useState(null)
  const [formData,setFormData] = useState({})
  const [imageFileUploading,setImageFileUploading] = useState(false)

  const handleUploadImage = async () => {
    try {
      if (!imageFile) {
        setImageFileUploadError("Please select an image")
        return;
      }
      setImageFileUploadError(null)
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
            setFormData({ ...formData, image: downloadedURL });
            setImageFileUploading(false);
            setImageFileUploadProgress(null)
          });
        }
      );
      
    } catch (error) {
      setImageFileUploadError("Error in image upload")
      console.log(error);
    }
  };
  
  return (
    <div className="px-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-extralight">
        Create a post
      </h1>
      <form className="flex flex-col gap-4 ">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="title"
            required
            id="title"
            className="flex-1"
          />
          <Select>
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          ></FileInput>
         
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled = {imagFileUploadProgress}
          >
            {imagFileUploadProgress ? <div className="w-16 h-16">
            <CircularProgressbar value={imagFileUploadProgress} text={`${imagFileUploadProgress || 0}`}></CircularProgressbar>
          </div> : 'Upload Image' }
          </Button>
        </div>
        {imageFileUploadError && <Alert color='failure'>{imageFileUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt='upload'
            className='w-full h-72 object-cover'
          />
        )}
        <ReactQuill
          required
          className="h-72 mb-12"
          theme="snow"
          placeholder="Write Something..."
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
      </form>
    </div>
  );
}

export default CreatePost;
