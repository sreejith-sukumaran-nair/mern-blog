import User from "../models/user.models.js"
import bcryptjs from 'bcryptjs';

export const signup = async ( req,res ) => {
  const { username , email , password } = req.body ;
  if(!username || !email || !password || username === '' || email === '' || password === ''){
    return res.status(400).json({message : "all fields are require"})
  }
  const hashedPassword = bcryptjs.hashSync(password,10)
  const newUser = new User({username,email,password : hashedPassword });

  try {
    await newUser.save();
    res.json("signed up successfully");
  } catch (error) {
    res.status(500).json(error.message)
  }

}