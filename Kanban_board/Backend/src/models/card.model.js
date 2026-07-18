import mongoose,{Schema} from "mongoose";

const cardSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    list:{
        type:Schema.Types.ObjectId,
        ref:"List",
        required:true
    },
    position:{
        type:Number,
        required:true // For ordering cards from top-to-bottom
    }
},{timestamps:true})

export const Card = mongoose.model("Card",cardSchema)