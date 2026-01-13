import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";

const conn = async ()=>{
  try {
    const connInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`\n MongoDB connected SUCCESSFULLY !!! \n DB hosted on : ${connInstance.connection.host}`);
    console.log(`${connInstance}`);
    
    
  } catch (error) {
    console.error(`MONGODB connection FAILED : ${error}`);
    process.exit(1);
  }
}

export default conn;