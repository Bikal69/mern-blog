import express from 'express';
import {verifyToken} from '../utils/verifyUser.js'
import { createComment, deleteComment, deleteReply, editComment, editReply, getComments, getPostComments, getReplies, likeComment, likeReply, postReply} from '../controllers/comment.controller.js';
const router=express.Router();
router.post('/create',verifyToken,createComment);
router.get('/getComments',verifyToken,getComments)
router.get('/getPostComments/:postId',getPostComments);
router.put('/likeComment/:commentId',verifyToken,likeComment);
router.put('/editComment/:commentId',verifyToken,editComment);
router.delete('/deleteComment/:commentId',verifyToken,deleteComment);
//reply routes
router.post('/postReply/:commentId',verifyToken,postReply);
router.get('/getReplies/:commentId',getReplies);
router.put('/editReply/:replyId',verifyToken,editReply);
router.delete('/deleteReply/:replyId',verifyToken,deleteReply)
router.put('/likeReply/:replyId',verifyToken,likeReply);
export default router;