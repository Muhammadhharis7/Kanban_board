import mongoose, {Schema} from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const userSchema = new Schema({
    userName:{
        type:String,
        required:true,
        unique:true,
        lowercase: true,
        trim: true,
    },
    fullName:{
        type:String,
        required:true,
        trim:true
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
    avatarPublicId:{
        type: String, // Cloudinary public_id, needed for deletion later
    },    
    refreshToken:{
        type:String
    }
},{timestamps:true})



userSchema.pre("save", async function (next){
    if(!this.isModified("password"))return next
    
    this.password = await bcrypt.hash(this.password,10)
    next
})


userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password,this.password)
}

// userSchema.methods.generateAccessToken = async function () {
//     return jwt.sign(
//         {},
//         process.env.ACCESS_TOKEN
//     )
// }

// userSchema.methods.generateRefreshToken = async function () {}


// now writing the custom method to generateAccessToken and this is jwt token
userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
        // payload name: value coming from database
        _id:this._id,
        email:this.email,
        userName:this.userName,
        fullName:this.fullName
        },
        process.env.ACCESS_TOKEN,
        {
            // Expiry object that we wrote in the .env file
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
)
}

// now writing the custom method to generateRefreshToken and this is also jwt token
userSchema.methods.generateRefreshToken = function (){
    return jwt.sign(
        {
        // payload name: value coming from database
        _id:this._id,
        // in this information is less because it is refreshed again and again
        },
        process.env.REFRESH_TOKEN,
        {
            // Expiry object that we wrote in the .env file
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
)
}



export const User = mongoose.model("User",userSchema)