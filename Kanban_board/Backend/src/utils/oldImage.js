import {v2 as cloudinary} from "cloudinary"


const oldImageToBeDeleted = async(imageId) => {
    try {
        let publicId;
    
        if(!imageId) return 
    
        if((typeof imageId === "string") && imageId !== ""){
            publicId = imageId
        }else if((imageId.public_id)){
            publicId = imageId.public_id
        }else{
            return
        }
    
        await cloudinary.uploader.destroy(publicId)
    } catch (error) {
        console.log("Failed to delete an old  image" , error);
    }
}

export{oldImageToBeDeleted}