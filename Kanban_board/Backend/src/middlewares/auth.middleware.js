import { Jwt } from "jsonwebtoken";
import { User } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

const verifyJWT = asyncHandler(async(req,_,next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authoriation")?.replace("Bearer","")

        if(!token){
            throw new ApiError(401,"Unauthorized request")
        }

        const decodedToken = Jwt.verify(token,process.env.ACCESS_TOKEN,{ algorithms: ["HS256"] })

        // if(!decodedToken){
        //     throw new ApiError(400,"Unauthorized request")
        // }

        const user = User.findById(decodedToken?._id).select("-password -refreshToken")

        if(!user){
            throw new ApiError(401,"Invalid Access Token")
        }

        req.user = user

        next()


    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid Access Token")
    }
})


export{verifyJWT}