import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'
const app=express()
app.use(express.json());
dotenv.config();
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log('successfully connected to db')
})

app.use('/api/user',userRoutes);
app.use('/api/auth',authRoutes);
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
app.listen(3000,()=>{
    console.log('server is running on port 3000')
})