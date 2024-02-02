import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
const app=express()
dotenv.config();
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log('successfully connected to db')
})
app.listen(3000,()=>{
    console.log('server is running on port 3000')
})