import { Button, FileInput, Select, TextInput } from 'flowbite-react'
import React from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function CreatePost() {
  return (
    <div className='px-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-extralight'>Create a post</h1>
      <form className='flex flex-col gap-4 '>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput type='text' placeholder='title' required id='title' className='flex-1'/>
          <Select>
          <option value='uncategorized'>Select a category</option>
            <option value='javascript'>JavaScript</option>
            <option value='reactjs'>React.js</option>
            <option value='nextjs'>Next.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput type='file' accept='image/*'></FileInput>
          <Button
            type='button'
            gradientDuoTone='purpleToBlue'
            size='sm'
            outline
          >
           
              Upload Image

          </Button>
        </div>
        <ReactQuill required className='h-72 mb-12' theme="snow" placeholder='Write Something...'/>
        <Button type='submit' gradientDuoTone='purpleToPink'>
          Publish
        </Button>
      </form>
    </div>
  )
}

export default CreatePost