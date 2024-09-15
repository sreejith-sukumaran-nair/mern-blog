import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';


export const verifyToken = async(req,res,next) => {
  const token = req.cookies.access_token;
  if(!token){
    return next(errorHandler(401,"unauthorised access"))
  }
  jwt.verify(token,process.env.JWT_SECRET,( err, user ) => {
    if(err){
      return next(errorHandler(401,"unauthorized"))
    }
    req.user = user ; // attaching user to the req
    next()
  })
}