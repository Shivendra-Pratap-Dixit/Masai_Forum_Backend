const express = require('express');
const router = express.Router();
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const User = require('../Models/user.model');
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken")
require("dotenv").config()


const userSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: passwordComplexity().required(),
    avatar: Joi.string().uri(),
});


router.post("/register",async(req,res)=>{
    const {error}=userSchema.validate(req.body);
    if(error) return res.status(400).send({message:error.details[0].message});
    const user=await User.findOne({email:req.body.email});
    if(user) return res.status(403).send({message:"User with this Email is Already Exists"});
    const salt=await bcrypt.genSalt(5);
    const hashPassword=await bcrypt.hash(req.body.password,salt);
    let newUser=await new User({
        ...req.body,
        password:hashPassword
    }).save();
    newUser.password=undefined;
    newUser._v=undefined;
    res.status(201).send({data:newUser,message:"Your Masai Forum Account Created Successfully"})
})


router.post("/login",async(req,res)=>{
    const user=await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send({message:"Invalid Email or Password"})
    const validpassword=await bcrypt.compare(req.body.password,user.password);
    if(!validpassword) return res.status(400).send({message:"Invalid Email or Password"});
    const token=jwt.sign(
        {_id:user._id,name:user.username,},process.env.Secretkey,{expiresIn:"1d"}
    )
    res.status(200).send({token:token,userId:user._id,name:user.username,avatar:user.avatar,message:"Signing In Please wait... "});
})

module.exports=router;