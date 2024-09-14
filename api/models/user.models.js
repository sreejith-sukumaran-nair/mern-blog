import mongooose from 'mongoose';

const userSchema = new mongooose.Schema({
  username : {
    type : String ,
    required : true ,
    unique : true ,
  },
  email : {
    type : String ,
    required : true ,
    unique : true ,
  },
  password : {
    type : String ,
    required : true ,
  },
  profilePicture : {
    type : String ,
    default : "https://images.pexels.com/photos/428364/pexels-photo-428364.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" ,
  },
  isAdmin : {
    type : Boolean ,
    default : false ,
  }
},{ timestamps : true });

const User = mongooose.model("User" , userSchema );

export default User ;