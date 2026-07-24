import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createUser = asyncHandler(async(req,res) => {
    const {} = req.body
})