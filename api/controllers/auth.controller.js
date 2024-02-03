import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
export const signup=async (req,res)=>{
    const {username,email,password}=req.body;
    if(!username || !email||!password||username===''||password===''){
        return res.status(400).json({message:'All fields are required'});
    }
    const hashedPassword=bcryptjs.hash(password,10);
    const newUser=new User({
username,
email,
password: await hashedPassword
    });
    await newUser.save().then(()=>res.json('signup successfull')).catch((err)=>res.status(500).json({message:err.message
    }))

}
