import User from "../models/user.models.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs'

export const test = (req,res) => {
  res.json({"message" : "Test api is working"})
}

export const updateUser = async(req,res,next) => {
  if(req.user.id !== req.params.userId){
    return next(errorHandler(401,'you are not allowed to update this user'))
  }
  if(req.body.password){
    if( req.body.password < 6 ){
      return next(errorHandler(400,"password must have atlest 6 characters"))
    }
    req.body.password = bcryptjs.hashSync(req.body.password,10)
  }
  if(req.body.username){
    if(req.body.username < 7 || req.body.username > 20){
      return next(errorHandler(400,'userame must be between 7 and 20 characters'))
    }
    if(req.body.username.includes(" ")){
      return next(errorHandler(400,'userame should not have spaces'))
    }
    if(req.body.username !== req.body.username.toLowerCase()){
      return next(errorHandler(400,'userame must be in lowercase'))
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, 'Username can only contain letters and numbers')
      )
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async(req,res,next) => {
  if(req.user.id !== req.params.userId){
    return next(errorHandler(401,'you are not allowed to delete this user'))
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("User deleted successfully")
  } catch (error) {
    next(error)
  }
}

export const signout = async(req,res,next) => {
  try {
    res.clearCookie('access_token').status(200).json("user has been signed out")
  } catch (error) {
    next(error)
  }
}