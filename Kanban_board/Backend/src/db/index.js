// import {ApiError} from "../utils/ApiError.js"
// import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import mongoose from "mongoose"
const connectDB = async() =>{
    try {
        const dbConnection = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB connected: ${dbConnection.connection.host}`);
    } catch (error) {
        console.log(`Error : ${error}`);
        process.exit(1);
    }
}

export default connectDB;