import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js'
const app=express()
dotenv.config();
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log('successfully connected to db')
})

app.use('/api/user',userRoutes);
app.listen(3000,()=>{
    console.log('server is running on port 3000')
})