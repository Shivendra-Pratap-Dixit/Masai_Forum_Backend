const express=require("express")
const mongoose=require("mongoose");
const router = require("./Routes/user.route");
const postRouter=require("./Routes/post.route")
require("dotenv").config()
const cors=require("cors")
const app=express();

const PORT=8080 || process.env.Port

app.get("/",(req,res)=>{
    res.status(200).send({message:"Welcome to Backend of Masai Forum here you can login and register by route(api/register ,api/login) For Posts  get (api/posts) post (api/posts) update,delete(api/posts/:post_id) like (api/posts/:post_id/like) comment (api/posts/:post_id/comment)"})
})
app.use(express.json())
app.use(cors())
app.use("/api",router)
app.use("/api",postRouter)
app.listen(PORT,async ()=>{
    try {
        await mongoose.connect(process.env.DBURL)
    console.log(`Server is running at ${PORT} and connected to Database`)
    } catch (error) {
        console.error(error)
    }
    
})