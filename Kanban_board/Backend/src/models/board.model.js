import mongoose , {Schema} from "mongoose";

const boardSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    members:[{
        type:Schema.Types.ObjectId,
        ref:"User"
    }]
},{timestamps:true})

export const Board = mongoose.model("Board",boardSchema)