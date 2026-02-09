import dotenv from "dotenv";
// import express from 'express';
import { app } from "./app.js";
// import mongoose from "mongoose";
// import {DB_NAME} from "./constants"
import conn from "./db/conn.js";

// const app = express();
dotenv.config({
  path : './.env'
})

const port = (process.env.PORT || 8000);

conn()
.then( ()=>{
  app.listen( port , ()=>{
    console.log(`Server is running on ${port}`);
    
  } )
} )
.catch( (err)=>{
  console.error("MONGODB CONNECTION FAILED !!! via index.js");
  console.error("Error details:", err);
    process.exit(1);           // ← recommended: stop the app if DB fails
} )












/*

An example of establishing connection to DB through mongoose

import express from "express";
const app = express()
;( async ()=>{
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error)=>{
      console.log("Error : "+ error);
      throw error;
    })

    app.listen(process.env.PORT, ()=>{
      console.log(`App is listening on port : ${process.env.PORT}`);
    })

  } catch (error) {
    console.error(`Error : ${error}`);
  }
} )()

  */