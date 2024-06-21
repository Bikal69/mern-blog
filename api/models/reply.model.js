import mongoose from "mongoose";
const replySchema=new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    commentId:{
        type:String,
        required:true
    },
    likes:[
        {type:String}
    ],
    numberOfLikes:{
        type:Number,
        default:0,
    },
    replyingTo:{
        type:String,
        default:null,
    }
},{timestamps:true});
const Reply=mongoose.model('Reply',replySchema,'replies');
export default Reply;