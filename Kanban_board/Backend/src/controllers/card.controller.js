import {asyncHandler} from "../utils/asyncHandler.js"
import {Card} from "../models/card.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { isValidObjectId } from "mongoose"


const createCard = asyncHandler(async(req,res) => {
    const {title,position,description,list} = req.body

    if((!title || position === undefined || !list)){
        throw new ApiError(400,"title,position or list is missing")
    }

    // const dummyList = "64f3a2b1c8e4f5a6b7c8d9e1"

    const card = await Card.create({
        title,
        position,
        description,
        list:list
    })

    if(!card){
        throw new ApiError(404,"Card not created")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,card,"Card created successfully"))

})

const getAllCardsFromTheList = asyncHandler(async(req,res) => {
    const {listId} = req.params

    if(!isValidObjectId(listId)){
        throw new ApiError(400,"Invlaid card id")
    }

    const allCards = await Card.find({list:listId}).sort({position:1})

    // if(!allCards){
    //     throw new ApiError(404,"Cards not found")
    // }
    return res
    .status(200)
    .json(new ApiResponse(200,allCards,"All cards are fetched successfully"))
})

const updateCard = asyncHandler(async(req,res) => {
    const {cardId} = req.params
    const {title,description,list,position} = req.body

    if(!isValidObjectId(cardId)){
        throw new ApiError(400,"Invalid card id")
    }
    // if(!(title || description)){
    //     throw new ApiError(400,"title or description are missing")
    // }

    if(!title && !description && !list && position === undefined){
        throw new ApiError(400,"Nothing to update")
    }

    const cardUpdate = await Card.findByIdAndUpdate(
        cardId,
        {
            $set:{
                title,
                description,
                list,
                position
            }
        },{new:true}
    )
    
    if(!cardUpdate){
        throw new ApiError(404,"Card not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,cardUpdate,"Card updated successfully"))
})

const deleteCard = asyncHandler(async(req,res) => {
    const {cardId} = req.params

    if(!isValidObjectId(cardId)){
        throw new ApiError(400,"Invalid card id")
    }

    const cardDelete = await Card.findByIdAndDelete(cardId)

    if(!cardDelete){
        throw new ApiError(404,"Card not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,{},"Card deleted successfully"))
})

export{
    createCard,
    updateCard,
    getAllCardsFromTheList,
    deleteCard
}