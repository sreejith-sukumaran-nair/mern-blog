import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  userId : {
    type : String ,
    required  : true ,
  } ,
  content : {
    type : String ,
    required : true ,
  },
  title : {
    type : String ,
    required : true ,
  },
  image : {
    type : String ,
    default : 'https://media.istockphoto.com/id/1924137135/photo/online-blog-search-learning-work-internet-freelance-business-post-website-online-homepage.webp?a=1&b=1&s=612x612&w=0&k=20&c=YUwT30LGjjflugUwWCseBxdXs8mvwuRvzNNnN-W5gNQ='
   },
   category : {
    type : String ,
    default : "uncategorized",
   },
   slug : {
    type : String ,
    required : true ,
    unique : true , 
   }
},{timestamps : true})

const Post = mongoose.model('Post',postSchema);

export default Post ;