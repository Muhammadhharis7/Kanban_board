import {asyncHandler} from "../utils/asyncHandler.js"
import {Board} from "../models/board.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { isValidObjectId } from "mongoose"

const createBoard = asyncHandler(async(req,res) => {
    const {title,description} = req.body
    if(!title){
        throw new ApiError(400,"Title is not there")
    }
    const dummyOwnerId = "64f3a2b1c8e4f5a6b7c8d9e0"

    const board = await Board.create({
        title,
        description,
        owner: dummyOwnerId,
        members:[dummyOwnerId]
    })

    if(!board){
        throw new ApiError(404,"Board not created")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,board,"Board created successfully"))
})

const getAllBoards = asyncHandler(async(req,res) => {
    // Get the particular user id for which you have to show the board for
    const dummyOwnerId = "64f3a2b1c8e4f5a6b7c8d9e0"

    const allBoards = await Board.find({members:dummyOwnerId})

    if(!allBoards){
        throw new ApiError(400,"Something went wrong")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,allBoards,"All boards arerendered successfully"))
})

const getOneBoard = asyncHandler(async(req,res) => {
    // Get the user id for which the user requested to show the board
    const {boardId} = req.params
    if(!isValidObjectId(boardId)){
        throw new ApiError(400,"Invalid  BoardId")
    }

    const oneBoard = await Board.findById(boardId)

    if(!oneBoard){
        throw new ApiError(404,"Board not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,oneBoard,"One board rendered successfully"))
})

const updateBoard = asyncHandler(async(req,res) =>  {
    const {boardId} = req.params
    const {title, description} = req.body
    
    if(!isValidObjectId(boardId)){
        throw new ApiError(400,"Invalid  BoardId")
    }
    if(!title){
        throw new ApiError(400,"title is missing")
    }

    const boardUpdate = await Board.findByIdAndUpdate(
        boardId,
        {
            $set:{
                title,
                description
            }
        },{new:true}
    )

    if(!boardUpdate){
        throw new ApiError(404,"Board not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,boardUpdate,"Board updated successfully"))
})

const deleteBoard = asyncHandler(async(req,res) => {
    const {boardId} = req.params
    if(!isValidObjectId(boardId)){
        throw new ApiError(400,"Invalid  BoardId")
    }

    const boardDelete = await Board.findByIdAndDelete(boardId)

    if(!boardDelete){
        throw new ApiError(404,"Board not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,{},"Board deleted successfully"))
})

export {
    createBoard,
    getAllBoards,
    getOneBoard,
    updateBoard,
    deleteBoard
}