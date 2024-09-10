import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';


dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(() => console.log("MongoDB is connected successfully")).catch((error) => console.log(error))

const app = express();

app.use(express.json())







app.listen(3000,()=>{
  console.log('Server is up and running on port 3000')
})

app.use('/api/user' , userRoutes );
app.use('/api/auth' , authRoutes);

app.use((err,req,res,next) => {
  let statusCode = err.statusCode || 500 ;
  let message = err.message || "Internal server error" ;
  res.status(statusCode).json({
    success : false , 
    statusCode ,
    message 
  })
})