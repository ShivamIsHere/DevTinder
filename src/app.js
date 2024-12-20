const express = require('express');

const app=express();


app.get("/",(req,res)=>{
    res.send("This is Home Page")
});
app.get("/profile",(req,res)=>{
    res.send("This is Profile Page")
});
app.get("/test",(req,res)=>{
    res.send("Hello Hello Hello")
});

app.listen(7777,()=>{
    console.log("Server is successfully listening on port 7777....")
})
