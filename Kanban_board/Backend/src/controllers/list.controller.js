import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {isValidObjectId} from "mongoose"
import { List } from "../models/list.model.js"

const createList = asyncHandler(async(req,res) => {
    const {title,position,board} = req.body

    if(!(title || position)){
        throw new ApiError(400,"title or position is missing")
    }

    // const dummyBoard = "64f3a2b1c8e4f5a6b7c8d9e2"

    const list = await List.create({
        title,
        position,
        board
    })

    if(!list){
        throw new ApiError(404,"List not created")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,list,"List created successfully"))

})

const getAllListFromTheBoard = asyncHandler(async(req,res) => {
    const {boardId} = req.params

    if(!isValidObjectId(boardId)){
        throw new ApiError(400,"Invlaid list id")
    }

    const allLists = await List.find({board:boardId}).sort({position:1})

    if(!allLists){
        throw new ApiError(404,"Lists not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,allLists,"All lists fetched successfully"))
})

const updateList = asyncHandler(async(req,res) => {
    const {listId} = req.params
    const {title,description,newPosition} = req.body

    if(!isValidObjectId(listId)){
        throw new ApiError(400,"Invalid list id")
    }
    // if(!(title || description)){
    //     throw new ApiError(400,"title or description are missing")
    // }

    if(!title && !description && newPosition === undefined){
        throw new ApiError(400,"Nothing to update")
    }

    const listUpdate = await List.findByIdAndUpdate(
        listId,
        {
            $set:{
                title,
                description,
                position:newPosition
            }
        },{new:true}
    )
    
    if(!listUpdate){
        throw new ApiError(404,"List not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,listUpdate,"List updated successfully"))
})

const deleteList = asyncHandler(async(req,res) => {
    const {listId} = req.params

    if(!isValidObjectId(listId)){
        throw new ApiError(400,"Invalid list id")
    }

    const listDelete = await List.findByIdAndDelete(listId)

    if(!listDelete){
        throw new ApiError(404,"List not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,{},"List deleted successfully"))
})

export{
    createList,
    updateList,
    getAllListFromTheBoard,
    deleteList
}