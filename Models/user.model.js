const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    username: { type: String, unique: true, required: true, minlength: 3, maxlength: 30 },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    avatar: { type: String },
}, { timestamps: true }
)
const User=mongoose.model("user",userSchema)
module.exports=User;