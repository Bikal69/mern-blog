import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js";
export const signup=async (req,res,next)=>{
    const {username,email,password}=req.body;
    console.log(req.body)
    if(!username || !email||!password||username===''||password===''){
       next(errorHandler(400,'All fields are required'));
    }
    const hashedPassword=bcryptjs.hash(password,10);
    const newUser=new User({
username,
email,
password: await hashedPassword
    });
    try{
        await newUser.save()
        res.json('signup successfull')
    }catch(err){
        next(err)
    }

}
