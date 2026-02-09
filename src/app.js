import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use( cors({
  origin : process.env.CORS_ORIGIN,
  credentials : true
}) )

app.use( express.json({  limit : "32kb"}) )
app.use( express.urlencoded({  extended: true ,   limit : "16kb" }) )
app.use( express.static("public") )
app.use( cookieParser() )

//routes import

import userRoute from "./routes/user.route.js";
app.use("/api/v1/users",userRoute);

export {app};








// import express from "express";
// import cookieParser from "cookie-parser";
// import cors from "cors";

// // routes
// import userRouter from "./routes/user.route.js";

// const app = express();

// // ========================
// //  CORS Configuration
// // ========================
// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN,          // e.g. "http://localhost:5173" or ["http://localhost:5173", "https://yourdomain.com"]
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// // ========================
// //  Body Parsers
// // ========================
// app.use(
//   express.json({
//     limit: "32kb",           // reasonable for most APIs
//   })
// );

// app.use(
//   express.urlencoded({
//     extended: true,
//     limit: "16kb",
//   })
// );

// // ========================
// //  Static files
// // ========================
// app.use(express.static("public"));

// // ========================
// //  Cookie Parser
// // ========================
// app.use(cookieParser());

// // ========================
// //  Routes
// // ========================
// app.use("/api/v1/users", userRouter);

// // Optional: Health check route (very useful during development)
// app.get("/api/v1/health", (req, res) => {
//   res.status(200).json({
//     status: "ok",
//     message: "Server is running",
//     uptime: process.uptime(),
//   });
// });

// // Export the app (for testing / server file)
// export { app };