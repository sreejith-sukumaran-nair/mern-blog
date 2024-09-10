import User from "../models/user.models.js"
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";

export const signup = async ( req , res , next  ) => {
  const { username , email , password } = req.body ;
  if(!username || !email || !password || username === '' || email === '' || password === ''){
    return next(errorHandler(401,"All fields are required...Please double chech before you dispatch the action"))
  }
  const hashedPassword = bcryptjs.hashSync(password,10)
  const newUser = new User({username,email,password : hashedPassword });

  try {
    await newUser.save();
    res.json("signed up successfully");
  } catch (error) {
    next(error)
  }
}