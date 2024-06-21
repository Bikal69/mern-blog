import mongoose, { Types } from "mongoose";
const  commentSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true,
    },
    postId:{
        type:String,
        required:true,
    },
    userId:{
        type:String,
        required:true,
    },
    likes:{
        type:Array,
        default:[],
    },
    replies:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Reply'
        }
    ],
    numberOfLikes:{
        type:Number,
        default:0,
    }
},{timestamps:true});
const Comment=mongoose.model('Comment',commentSchema);
export default Comment;