import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
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
        res.status(200).json('signup successfull')
    }catch(err){
        next(err)
    }

};
export const signin=async(req,res,next)=>{
    const {email,password}=req.body;
    if(!email||!password||email===''||password===''){
 return next(errorHandler(400,'All fields are required'));
    }
    try{
const validUser=await User.findOne({email});
if(!validUser){
    return next(errorHandler(404,'User not found'));
}
const validPassword=await bcryptjs.compare(password,validUser.password);
if(!validPassword){
  return  next(errorHandler(400,'Wrong credientials'));//we used wrong creditential msg instead of being specific to what is incorrect because we don't want to give hacker a hint which one is incorrect
}
const token=jwt.sign(
    { id:validUser._id,isAdmin:validUser.isAdmin },process.env.JWT_SECRET,{expiresIn:'30d'}
);
const {password:pass,...rest}=validUser._doc;//._doc gives the js object containing user data in javascript object format
res.status(200).cookie('access_token',token,{httpOnly:true}).json(rest)
    }catch(error){
next(error);
    }
}

export const google=async(req,res,next)=>{
    const {name,email,googlePhotoUrl}=req.body;
    try{
        const user=await User.findOne({email});
        if(user){
            const token=jwt.sign({id:user._id,isAdmin:user.isAdmin},process.env.JWT_SECRET);
            const {password,...rest}=user._doc;
            res.status(200).cookie('access_token',token,{
                httpOnly:true,
            }).json(rest);
        }else{
            const generatedPassword=Math.random().toString(36).slice(-8)
            const hashedPassword= await bcryptjs.hash(generatedPassword,10)
            const newUser=new User({
                username:name.toLowerCase().split(' ').join('')+Math.random().toString(9).slice(-4),
                email,
                password:hashedPassword,
               profilePicture:googlePhotoUrl,
            });
            await newUser.save();
            const token=jwt.sign({id:newUser._id,isAdmin:newUser.isAdmin},process.env.JWT_SECRET);
            const {password,...rest}=newUser._doc;
            res.status(200).cookie('access_token',token,{httpOnly:true}).json(rest);
        }
    }catch(error){
next(error);
    }
}
export const isUserSignedin=async(req,res)=>{
    const token=req.cookies.access_token;
    if(!token){
       return res.status(401).json('No token,Unauthorized');
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err){
         return   res.status(401).json('user token has expired')
        }

    })
}