import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import { checkRequiredFields, validateEmail, validatePassword } from "../validator/user.validator.js"

import { imageToBeUploadedToCloudinary } from "../utils/cloudinary.js"
import { oldImageToBeDeleted } from "../utils/oldImage.js"

const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)

        if(!user){
            throw new ApiError(400,"Invalid credentials")
        }

        const accessToken = user.generateAccessToken()

        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken

        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}


    } catch (error) {
        console.log("Generate token error " , error);
        throw new ApiError(400,"Something went wrong while generating access token and refresh token")
    }
}

const registerUser = asyncHandler(async(req,res) => {
    const {userName,email,password,refreshToken,fullName} = req.body

    // call each validator seperately
    checkRequiredFields(userName,email,password,fullName)
    // Email verification
    validateEmail(email)
    // Password Strength
    validatePassword(password)

    // Check if the user already existed 
    const existingUser = await User.findOne({
        $or:[{email},{userName}]
    })

    if(existingUser){
       if(existingUser.userName === userName){
        throw new ApiError(409,"Username already taken")
       }
       if(existingUser.email === email){
        throw new ApiError(409,"Email already taken")
       } 
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is not present")
    }

    const avatar = await imageToBeUploadedToCloudinary(avatarLocalPath)

    if(!avatar?.url){
        throw new ApiError(400,"Avatar image is required")
    }

    const user = await User.create({
        userName: userName.toLowerCase(),
        email,
        fullName,
        password,
        avatar:avatar.url,
        avatarPublicId:avatar.public_id
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500,"User is not created")
    }

    return res
    .status(201)
    .json(new ApiResponse(201,user,"User is created successfully"))
})

const loginUser = asyncHandler(async(req,res) => {
    const {userName,email,password} = req.body

    if(!(userName || email)){
        throw new ApiError(400,"User name or email is required")
    }
    validateEmail(email)

    

    const user = await User.findOne({
        $or:[{userName},{email}]
    })

    if(!user){
        throw new ApiError(404,"User doesn't exist")
    }

    if(!password){
        throw new ApiError(400,"Password is required")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(400,"invalid credentials")
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200,{user:loggedInUser,accessToken,refreshToken},"User logged in successfully"))
})

const logOutUser = asyncHandler(async(req,res)=> {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        }
    )

    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken",options)
    .cookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User logged  out successfully"))
})

const updateUser = asyncHandler(async(req,res) => {
    const {fullName,email} = req.body

    if(!(fullName || email)){
        throw new ApiError(400,"fullName or email is missing")
    }
    
    if (email) validateEmail(email)
    // validateEmail(email)


    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullName,
                email
            }
        },{new:true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200,user,"User details updated successfully"))

})

const changeCurrentUserPassword = asyncHandler(async(req,res) => {
    const {oldPassword,newPassword} = req.body

    const user = await User.findById(req.user._id)

    const isPasswordValid = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordValid){
        throw new ApiError(400,"Invalid old password")
    }

    validatePassword(newPassword)

    user.password = newPassword

    await user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(new ApiResponse(200,{},"Password updated successfully"))

})

const refreshAccessToken = asyncHandler(async(req,res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    
    if(!incomingRefreshToken){
        throw new ApiError(400,"Invalid credentials")
    }
    try {
        const decodedToken = await jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN)
    
        const user = await User.findById(decodedToken._id)
        
        if(!user){
            throw new ApiError(400,"Invalid refresh token")
        }

        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401,"Refresh token expired or used")
        }

        const options = {
            httpOnly:true,
            secure:true
        }


        const {accessToken,newRefreshToken} = await generateAccessAndRefreshToken(user?._id)


        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(new ApiResponse(200, {accessToken, refreshToken: newRefreshToken}, "Access token refreshed successfully"))
        // .json(
        //     200,
        //     {accessToken,refreshToken:newRefreshToken},
        //     "Access token refresh successfully"
        // )

    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid refresh token")
    }
    
 
})

const updateAvatarImage = asyncHandler(async(req,res) => {
    // const {oldImage,newImage} = req.files
    const oldImage = await User.findById(req.user?._id)
    if(!oldImage){
        throw new ApiError(404,"User not found")
    }

    // const oldAvatar = oldImage.avatar
    const oldAvatarPublicId = oldImage.avatarPublicId 

    const newAvatarImageLocalPath = req.files?.avatar?.[0]?.path

    if(!newAvatarImageLocalPath){
        throw new ApiError(400,"Avatar Image is missing")
    }

    const avatarImage = await imageToBeUploadedToCloudinary(newAvatarImageLocalPath)

    if(!avatarImage){
        throw new ApiError(400,"Something went wrong")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar:avatarImage.url,
                avatarPublicId: avatarImage.public_id
            }
        },{new:true}
    ).select("-password")

    if(!user){
        throw new ApiError(400,"New Image not updated")
    }
    await oldImageToBeDeleted(oldAvatarPublicId)

    return res
    .status(200)
    .json(new ApiResponse(200,{},"Avatar Image changed successfully"))

})

const getCurrentUser = asyncHandler(async(req,res) => {
    return res.
    status(200)
    .json(new ApiResponse(200,req.user,"Current user fetched successfully"))
})


export{
    registerUser,
    loginUser,
    logOutUser,
    updateUser,
    updateAvatarImage,
    changeCurrentUserPassword,
    refreshAccessToken,
    getCurrentUser
}