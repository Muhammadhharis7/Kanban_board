import mongoose, {Schema} from "mongoose"

const userSchema = new Schema({
    userName:{
        type:String,
        required:true,
        unique:true
    },
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        required:true
    },
    refreshToken:{
        type:String
    }
},{timestamps:true})

export const User = mongoose.model("User",userSchema)

