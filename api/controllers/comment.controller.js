import Comment from "../models/comment.model.js";
import Reply from "../models/reply.model.js";
import { errorHandler } from "../utils/error.js";

export const createComment=async(req,res,next)=>{
    try{
        const {content,postId,userId}=req.body;
        if(userId!==req.user.id){
            return next(errorHandler(403,'You are not allowed to create this comment'));
        }
        const newComment=new Comment({
            content,
            postId,
            userId,
        });
        await newComment.save();
        res.status(200).json(newComment);
    }catch(error){
        next(error);
    }
}
//get all comments
export const getComments=async(req,res,next)=>{
    if(!req.user.isAdmin){
        return errorHandler(403,'You are not allowed to get all comments')
    }
    try{
        const startIndex=req.query.startIndex||0;
        const limit=req.query.limit||9;
        const comments=await Comment.find().sort({createdAt:-1}).skip(startIndex).limit(limit);
        const totalComments=await Comment.countDocuments();
        const now=new Date();
        const oneMonthAgo=new Date(now.getFullYear(),now.getMonth()-1,now.getDate());
        const lastMonthComments=await Comment.countDocuments({createdAt:{$gte:oneMonthAgo}});
        res.status(200).json({comments,totalComments,lastMonthComments});
    }catch(error){
        next(error)
    }
}
//get comment from specific post
export const getPostComments=async(req,res,next)=>{
    try{
        const comments=await Comment.find({postId:req.params.postId}).sort({createdAt:-1});
        res.status(200).json(comments);
    }catch(error){
        next(error)
    }
}

export const likeComment=async(req,res,next)=>{
    try{
        const comment=await Comment.findById(req.params.commentId);
        if(!comment){
            return next(errorHandler(404,'Comment not found'))
        }
        const userIndex=comment.likes.indexOf(req.user.id);
        if(userIndex===-1){
            comment.numberOfLikes+=1;
            comment.likes.push(req.user.id);

        }else{
            comment.numberOfLikes-=1;
            comment.likes.splice(userIndex,1);
        }
        await comment.save();
        res.status(200).json(comment)
    }catch(error){
        next(error)
    }
}

//edit comment
export const editComment=async(req,res,next)=>{
try{
const comment=await Comment.findById(req.params.commentId);
if(!comment){
    return next(errorHandler(404,'Comment not found'));
}
if(comment.userId!==req.user.id&&!req.user.isAdmin){
    return next(errorHandler(403,'You are not allowed to ed it this comment'));
}
const editedComment=await Comment.findByIdAndUpdate(req.params.commentId,{
    content:req.body.content,
},{new:true});
res.status(200).json(editedComment)

}catch(error){
    next(error)
}
}

//delete comment controller
export const deleteComment=async(req,res,next)=>{
try{
    const comment=await Comment.findById(req.params.commentId);
    const replies=await Reply.deleteMany({commentId:req.params.commentId});
    if(!comment){
        return next(errorHandler(404,'Comment not found'));
    }
    if(comment.userId!==req.user.id&&req.userId){
        return next(errorHandler(403,'You are not allowed to delete this comment'));
    }
await Comment.findByIdAndDelete(req.params.commentId);
res.status(200).json('Successfully deleted Comment')
}catch(error){
    next(error)
}
};

//post reply
export const postReply=async(req,res,next)=>{
    try{
        const {content}=req.body;
    const comment=await Comment.findById(req.params.commentId);
    if(!comment){
        return next(404,"comment not found");
    };
    const reply=new Reply({
            content,
            user:req.user.id,
            commentId:req.params.commentId,
            replyingTo:req.body.replyingTo||null
        });
        await reply.save();
    comment.replies.push(reply._id);
   await comment.save();
   const sendingReply=await reply.populate({
    path:'user',
    select:'-password -email'
})
    res.status(200).json(sendingReply);
    
    }catch(error){
    next(error);
    }
    };

    //get replies controller
    export const getReplies=async(req,res,next)=>{
        try{
            const startIndex=req.query.startIndex||0;
            const replies=await Reply.find({commentId:req.params.commentId}).sort({updatedAt:1}).skip(startIndex).limit(5).populate({
                path: 'user',
                select: '-password -email' // Exclude password and email fields
              });
            if(replies){
                res.status(200).json(replies);
            }
        }catch(error){
            next(error);
        }
    }

    //edit reply
    export const editReply=async(req,res,next)=>{
        try{
        const reply=await Reply.findById(req.params.replyId);
        if(!reply){
            return next(errorHandler(404,'reply not found'));
        }
        if(reply.user._id!==req.user._id&&!req.user.isAdmin){
            return next(errorHandler(403,'You are not allowed to ed it this comment'));
        }
        if(req.body.content){
            const editedReply=await Reply.findByIdAndUpdate(req.params.replyId,{
                content:req.body.content,
            },{new:true});
            res.status(200).json(editedReply)
        }
        else{
            return next(422,"Empty reply cannot be edited");
        }
        
        }catch(error){
            next(error)
        }
        }
//delete reply
export const deleteReply=async(req,res,next)=>{
    try{
        const reply=await Reply.findById(req.params.replyId);
        const comment=await Comment.findById(reply.commentId);
        if(!reply){
            return next(errorHandler(404,'reply not found'));
        }
        if(reply.user._id!==req.user.id&&req.userId){
            return next(errorHandler(403,'You are not allowed to delete this comment'));
        }
    await Reply.findByIdAndDelete(req.params.replyId);
   const replyIndex= comment.replies.indexOf(reply._id);
    if(replyIndex===-1){
        return res.status(200).json('oops the reply doesnot exist or has been deleted already!');
    }else{
        comment.replies.splice(replyIndex,1);
        await comment.save();
        res.status(200).json('Successfully deleted Comment');
    }
    }catch(error){
        next(error)
    }
    }; 
//like reply
export const likeReply=async(req,res,next)=>{
    try{
        const reply=await Reply.findById(req.params.replyId);
        if(!reply){
            return next(errorHandler(404,'reply not found'))
        }
        const userIndex=reply.likes.indexOf(req.user.id);
        if(userIndex===-1){
            reply.numberOfLikes+=1;
            reply.likes.push(req.user.id);

        }else{
            reply.numberOfLikes-=1;
            reply.likes.splice(userIndex,1);
        }
        await reply.save();
        res.status(200).json(reply)
    }catch(error){
        next(error)
    }
} 