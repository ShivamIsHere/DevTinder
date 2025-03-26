const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

require("dotenv").config();

// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true,
// }));

app.use(
  cors({
    origin: ["http://localhost:5173","https://devtinder-8obd.onrender.com"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true,
  })
);


app.use(cookieParser());
app.use(express.json());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const chatRouter = require("./routes/chat");
const initializeSocket = require("./utils/socket");
// const notificationRouter = require("./routes/notification");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);
// app.use("/", notificationRouter);

const server = http.createServer(app);
initializeSocket(server);

connectDB()
.then(() => {
  app.get("/", (req, res) => {
    res.send("API WORKING");
  });
    console.log("Database connection established...");
    server.listen(process.env.PORT, () => {
      console.log("Server is listening on port 3000...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });
  
  // app.use(cors({
  //   origin: "http://localhost:5173", // Your frontend's URL
  //   methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'], // Allow PATCH
  //   allowedHeaders: ['Content-Type', 'Authorization'], // Allow required headers
  //   credentials: true, // Allow cookies
  // }));
  
  // app.options('*', (req, res) => {
  //   res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  //   res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  //   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  //   res.header('Access-Control-Allow-Credentials', 'true');
  //   res.sendStatus(204); // No content for OPTIONS requests
  // });