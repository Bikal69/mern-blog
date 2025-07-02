import express, { request } from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
const __dirname=path.resolve();
const app=express()
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
dotenv.config();
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log('successfully connected to db');
});
app.use('/api/user',userRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/post',postRoutes);
app.use('/api/comment',commentRoutes)
console.log(__dirname)
app.use(express.static(path.join(__dirname,'/client/dist')));
app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'client','dist','index.html'))
});
//error handling middleware
app.use((err,req,res,next)=>{
    const statusCode=err.statusCode||500;
    const message=err.message||'Internal server error';
    res.status(statusCode).json({
        success:false,
        statusCode,
        message
    })
})
{/*to keep render server alive */}
setInterval(()=>{},1000*60*13); //13 minutes
app.listen(3000,()=>{
    console.log('server is running on port 3000')
})