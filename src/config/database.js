const mongoose = require("mongoose");

const connectDB=async()=>{
    // mongoose.connect("mongodb+srv://DevTinder:devtinder1846@devtinder.pxjot.mongodb.net/");  cluster
    // await mongoose.connect("mongodb+srv://DevTinder:devtinder1846@devtinder.pxjot.mongodb.net/devTinder");
    await mongoose.connect(process.env.DB_CONNECTION_SECRET);
}


module.exports=connectDB;