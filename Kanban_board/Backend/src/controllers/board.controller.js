import {asyncHandler} from "../utils/asyncHandler.js"
import {Board} from "../models/board.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { isValidObjectId } from "mongoose"
import { checkBoardAccess } from "../utils/checkBoardAccess.js"
import { checkBoardOwner } from "../utils/checkBoardOwner.js"

const createBoard = asyncHandler(async(req,res) => {
    const {title,description} = req.body
    if(!title){
        throw new ApiError(400,"Title is not there")
    }
    // const dummyOwnerId = "64f3a2b1c8e4f5a6b7c8d9e0"

    const board = await Board.create({
        title,
        description,
        owner: req.user._id,
        members:[req.user?._id]
    })

    if(!board){
        throw new ApiError(404,"Board not created")
    }

    return res
    .status(201)
    .json(new ApiResponse(201,board,"Board created successfully"))
})

const getAllBoards = asyncHandler(async(req,res) => {
    // Get the particular user id for which you have to show the board for
    // const dummyOwnerId = "64f3a2b1c8e4f5a6b7c8d9e0"/

    // const allBoards = await Board.find({members:req.user?._id})

    const allBoards = await Board.find({
        $or: [
            { owner: req.user._id },
            { members: req.user._id }
        ]
    })

    // if(!allBoards){
    //     throw new ApiError(400,"Something went wrong")
    // }

    // if(allBoards.length === 0){
    //     // decide: is this actually an error, or just a normal empty state?
    //     throw new ApiError(400,"no boards found")
    // }

    return res
    .status(200)
    .json(new ApiResponse(200,allBoards,"All boards are rendered successfully"))
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

    // checkBoardAccess(req.user?._id)
    checkBoardAccess(oneBoard, req.user._id)
    // const isMember = oneBoard.members.some(
    //     memberId => memberId.toString() === req.user._id.toString()
    // )


    // const isOwner = oneBoard.owner.toString() === req.user._id.toString()

    // if(!isMember && !isOwner){
    //     throw new ApiError(403,"You do not have access to this board")
    // }

    // if(!isMember){
    //     throw new ApiError(403,"You do not have access to this board")
    // }

    return res
    .status(200)
    .json(new ApiResponse(200,oneBoard,"One board rendered successfully"))
})

// const updateBoard = asyncHandler(async(req,res) =>  {
//     const {boardId} = req.params
//     const {title, description} = req.body
    
//     if(!isValidObjectId(boardId)){
//         throw new ApiError(400,"Invalid  BoardId")
//     }
//     if(!title){
//         throw new ApiError(400,"title is missing")
//     }

//     const board = await Board.findById(boardId)
//     if(!board){
//         throw new ApiError(404,"Board not found")
//     }

//     checkBoardAccess(req.user?._id)
//     // const isMember = board.members.some(
//     //     memberId => memberId.toString() === req.user._id.toString()
//     // )
//     // const isOwner = board.owner.toString() === req.user._id.toString()

//     // if(!isMember && !isOwner){
//     //     throw new ApiError(403,"You do not have access to this board")
//     // }

//     // if(!isMember){
//     //     throw new ApiError(403,"You do not have access to this board")
//     // }

//     const boardUpdate = await Board.findByIdAndUpdate(
//         boardId,
//         {
//             $set:{
//                 title,
//                 description
//             }
//         },{new:true}
//     )

//     if(!boardUpdate){
//         throw new ApiError(404,"Board not found")
//     }
//     return res
//     .status(200)
//     .json(new ApiResponse(200,boardUpdate,"Board updated successfully"))
// })


const updateBoard = asyncHandler(async(req,res) =>  {
    const {boardId} = req.params
    const {title, description} = req.body
    
    if(!isValidObjectId(boardId)){
        throw new ApiError(400,"Invalid BoardId")
    }
    if(!title){
        throw new ApiError(400,"title is missing")
    }

    const board = await Board.findById(boardId)
    if(!board){
        throw new ApiError(404,"Board not found")
    }

    checkBoardAccess(board, req.user._id)

    const boardUpdate = await Board.findByIdAndUpdate(
        boardId,
        {
            $set:{
                title,
                description
            }
        },{new:true}
    )

    return res
    .status(200)
    .json(new ApiResponse(200,boardUpdate,"Board updated successfully"))
})


// const deleteBoard = asyncHandler(async(req,res) => {
//     const {boardId} = req.params
//     if(!isValidObjectId(boardId)){
//         throw new ApiError(400,"Invalid  BoardId")
//     }

//     const board = await Board.findById(boardId)
//     if(!board){
//         throw new ApiError(404,"Board not found")
//     }

//     checkBoardAccess(req.user?._id)
//     // const isOwner = board.owner.toString() === req.user._id.toString()

//     // if(!isOwner){
//     //     throw new ApiError(403,"Only the board owner can delete this board")
//     // }

//     const boardDelete = await Board.findByIdAndDelete(boardId)

//     if(!boardDelete){
//         throw new ApiError(404,"Board not found")
//     }

//     // const isOwner = board.owner.toString() === req.user._id.toString()

//     // if(!isOwner){
//     //     throw new ApiError(403,"Only the board owner can delete this board")
//     // }

//     return res
//     .status(200)
//     .json(new ApiResponse(200,{},"Board deleted successfully"))
// })



// const deleteBoard = asyncHandler(async(req,res) => {
//     const {boardId} = req.params
//     if(!isValidObjectId(boardId)){
//         throw new ApiError(400,"Invalid BoardId")
//     }

//     const board = await Board.findById(boardId)
//     if(!board){
//         throw new ApiError(404,"Board not found")
//     }

//     const isOwner = board.owner.toString() === req.user._id.toString()
//     if(!isOwner){
//         throw new ApiError(403,"Only the board owner can delete this board")
//     }

//     await Board.findByIdAndDelete(boardId)

//     return res
//     .status(200)
//     .json(new ApiResponse(200,{},"Board deleted successfully"))
// })

const deleteBoard = asyncHandler(async(req,res) => {
    const {boardId} = req.params
    if(!isValidObjectId(boardId)){
        throw new ApiError(400,"Invalid BoardId")
    }

    const board = await Board.findById(boardId)
    if(!board){
        throw new ApiError(404,"Board not found")
    }

    checkBoardOwner(board, req.user._id)

    await Board.findByIdAndDelete(boardId)

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