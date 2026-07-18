import fs from "fs"
import {ApiError} from "./ApiError.js"
import {v2 as cloudinary} from "cloudinary"

(async function(){
    cloudinary.config({
        cloud_name:process.env.CLOUD_NAME,
        api_key:process.env.CLOUDINARY_API_KEY,
        api_secret:process.env.CLOUDINARY_API_SECRET
    })
})();

const imageToBeUploadedToCloudinary = (async(localFilePath) => {
    try {
        if(!localFilePath){
        throw new ApiError(400,"There is no link")
        }

        console.log("Cloudinary received path : ",localFilePath);
       const response = await cloudinary.uploader.upload(localFilePath,{resource_type:"auto"})

        console.log("File Uploaded to cloudinary : ",response.url);
    
        console.log("Response : ",response);

        fs.unlinkSync(localFilePath)

        return {
            response,
            url:response.secure_url,
            public_id:response.public_id
        }
        } catch (error) {
            fs.unlinkSync(localFilePath)
            throw new ApiError(500,"Something went wrong")       
        }
})

export {imageToBeUploadedToCloudinary}
