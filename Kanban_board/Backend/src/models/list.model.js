import mongoose,{Schema} from "mongoose";

const listSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    board:{
        type:Schema.Types.ObjectId,
        ref:"Board",
        required:true
    },
    position:{
        type:Number,
        required:true // From ordering list from left-to-right
    }
},{timestamps:true})

export const List = mongoose.model("List",listSchema)