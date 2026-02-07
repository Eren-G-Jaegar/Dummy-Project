// import mongoose from "mongoose";
// import {DB_NAME} from "../constants.js";

// const conn = async ()=>{
//   try {
//     const connInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//     console.log(`\n MongoDB connected SUCCESSFULLY !!! \n DB hosted on : ${connInstance.connection.host}`);
//     // console.log(`${connInstance}`);
    
    
//   } catch (error) {
//     console.error(`MONGODB connection FAILED : ${error}`);
//     process.exit(1);
//   }
// }

// export default conn;


// src/db/conn.js   (or wherever connectDB lives)
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MONGO_URI:', process.env.MONGODB_URI ? 'exists' : 'MISSING!!!');

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log('──────────────────────────────────────────────');
    console.log('MongoDB connected SUCCESSFULLY');
    console.log('Host:', conn.connection.host);
    console.log('Database name:', conn.connection.name);
    console.log('──────────────────────────────────────────────');

    // Optional: log if connection drops later
    mongoose.connection.on('disconnected', () => {
      console.log('!!! MongoDB disconnected !!!');
    });

    mongoose.connection.on('error', (err) => {
      console.log('MongoDB error after initial connection:', err.message);
    });

  } catch (error) {
    console.log('──────────────────────────────────────────────');
    console.error('MONGODB CONNECTION FAILED');
    console.error('Error message:', error.message);
    if (error.stack) {
      console.error('Stack:', error.stack.split('\n').slice(0, 3).join('\n'));
    }
    console.log('──────────────────────────────────────────────');

    // Usually good to exit if DB is critical
    process.exit(1);
  }
};

export default connectDB;