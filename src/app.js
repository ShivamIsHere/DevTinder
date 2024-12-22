const express = require('express');

const app=express();

const {adminAuth,userAuth}=require("./middlewares/auth");

app.use("/admin",adminAuth);
app.get("/user/login",(req,res)=>{
    res.send("user is logged in")
});
app.get("/user",userAuth,(req,res)=>{
    res.send("User is Authorized")
})
app.get("/admin/getAllData",(req,res)=>{
    res.send("All Data Sent");
})
app.get("/admin/deleteUser",(req,res)=>{
    res.send("Deleted a user");
})
app.use("/",(req,res,next)=>{
    // res.send("This is Home Page")
    next();
});
app.use("/profile",(req,res)=>{
    res.send("This is Profile Page")
});
app.use("/test",(req,res)=>{
    res.send("Hello Hello Hello")
});

app.listen(7777,()=>{
    console.log("Server is successfully listening on port 7777....")
})
