import dotenv from "dotenv"

// import mongoose from "mongoose";
// import {DB_NAME} from "./constants"
import conn from "./db/conn.js";


dotenv.config({
  path : './env'
})

conn()












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