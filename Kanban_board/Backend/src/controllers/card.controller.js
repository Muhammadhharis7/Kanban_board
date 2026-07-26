import {asyncHandler} from "../utils/asyncHandler.js"
import {Card} from "../models/card.model.js"
import {Board} from "../models/board.model.js"
import {List} from "../models/list.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { isValidObjectId } from "mongoose"
import { checkBoardAccess } from "../utils/checkBoardAccess.js"


// const createCard = asyncHandler(async(req,res) => {
//     const {title,position,description,list} = req.body

//     if((!title || position === undefined || !list)){
//         throw new ApiError(400,"title,position or list is missing")
//     }

//     // const dummyList = "64f3a2b1c8e4f5a6b7c8d9e1"

//     const card = await Card.create({
//         title,
//         position,
//         description,
//         list:list
//     })

//     if(!card){
//         throw new ApiError(404,"Card not created")
//     }

//     return res
//     .status(201)
//     .json(new ApiResponse(201,card,"Card created successfully"))

// })




const createCard = asyncHandler(async(req,res) => {
    const {title,position,description,list} = req.body

    if(!title || position === undefined || !list){
        throw new ApiError(400,"title, position, or list is missing")
    }

    if(!isValidObjectId(list)){
        throw new ApiError(400,"Invalid list id")
    }

    // 1. Fetch the list this card is being added to
    const listExists = await List.findById(list)
    if(!listExists){
        throw new ApiError(404,"List not found")
    }

    // 2. Trace up to the board the list belongs to
    const board = await Board.findById(listExists.board)
    if(!board){
        throw new ApiError(404,"Board not found")
    }

    // 3. Check the requesting user has access to that board
    checkBoardAccess(board, req.user._id)

    // 4. Only now create the card
    const card = await Card.create({
        title,
        position,
        description,
        list
    })

    return res
    .status(201)
    .json(new ApiResponse(201,card,"Card created successfully"))
})



// const getAllCardsFromTheList = asyncHandler(async(req,res) => {
//     const {listId} = req.params

//     if(!isValidObjectId(listId)){
//         throw new ApiError(400,"Invlaid card id")
//     }

//     const allCards = await Card.find({list:listId}).sort({position:1})

//     // if(!allCards){
//     //     throw new ApiError(404,"Cards not found")
//     // }
//     return res
//     .status(200)
//     .json(new ApiResponse(200,allCards,"All cards are fetched successfully"))
// })


const getAllCardsFromTheList = asyncHandler(async(req,res) => {
    const {listId} = req.params

    if(!isValidObjectId(listId)){
        throw new ApiError(400,"Invalid list id")
    }

    const list = await List.findById(listId)
    if(!list){
        throw new ApiError(404,"List not found")
    }

    const board = await Board.findById(list.board)
    if(!board){
        throw new ApiError(404,"Board not found")
    }

    checkBoardAccess(board, req.user._id)

    const allCards = await Card.find({list:listId}).sort({position:1})

    return res
    .status(200)
    .json(new ApiResponse(200,allCards,"All cards are fetched successfully"))
})


// const updateCard = asyncHandler(async(req,res) => {
//     const {cardId} = req.params
//     const {title,description,list,position} = req.body

//     if(!isValidObjectId(cardId)){
//         throw new ApiError(400,"Invalid card id")
//     }
//     // if(!(title || description)){
//     //     throw new ApiError(400,"title or description are missing")
//     // }

//     if(!title && !description && !list && position === undefined){
//         throw new ApiError(400,"Nothing to update")
//     }


//     const updateFields = {}
//     if (title !== undefined) updateFields.title = title
//     if (description !== undefined) updateFields.description = description
//     if (list !== undefined) updateFields.list = list
//     if (position !== undefined) updateFields.position = position

//     const cardUpdate = await Card.findByIdAndUpdate(
//         cardId,
//         { $set: updateFields },
//         { new: true }
//     )



//     // const cardUpdate = await Card.findByIdAndUpdate(
//     //     cardId,
//     //     {
//     //         $set:{
//     //             title,
//     //             description,
//     //             list,
//     //             position
//     //         }
//     //     },{new:true}
//     // )
    
//     if(!cardUpdate){
//         throw new ApiError(404,"Card not found")
//     }

//     return res
//     .status(200)
//     .json(new ApiResponse(200,cardUpdate,"Card updated successfully"))
// })


const updateCard = asyncHandler(async(req,res) => {
    const {cardId} = req.params
    const {title,description,list,position} = req.body

    if(!isValidObjectId(cardId)){
        throw new ApiError(400,"Invalid card id")
    }

    if(!title && !description && !list && position === undefined){
        throw new ApiError(400,"Nothing to update")
    }

    // 1. Fetch the card first
    const card = await Card.findById(cardId)
    if(!card){
        throw new ApiError(404,"Card not found")
    }

    // 2. Trace up to the list
    const cardList = await List.findById(card.list)
    if(!cardList){
        throw new ApiError(404,"List not found")
    }

    // 3. Trace up to the board
    const board = await Board.findById(cardList.board)
    if(!board){
        throw new ApiError(404,"Board not found")
    }

    // 4. Check access
    checkBoardAccess(board, req.user._id)

    // 5. Only now perform the update
    const updateFields = {}
    if (title !== undefined) updateFields.title = title
    if (description !== undefined) updateFields.description = description
    if (list !== undefined) updateFields.list = list
    if (position !== undefined) updateFields.position = position

    const cardUpdate = await Card.findByIdAndUpdate(
        cardId,
        { $set: updateFields },
        { new: true }
    )

    return res
    .status(200)
    .json(new ApiResponse(200,cardUpdate,"Card updated successfully"))
})





const deleteCard = asyncHandler(async(req,res) => {
    const {cardId} = req.params

    if(!isValidObjectId(cardId)){
        throw new ApiError(400,"Invalid card id")
    }

    const card = await Card.findById(cardId)
    if(!card){
        throw new ApiError(404,"Card not found")
    }

    const list = await List.findById(card.list)
    if(!list){
        throw new ApiError(404,"List not found")
    }

    const board = await Board.findById(list.board)
    if(!board){
        throw new ApiError(404,"Board not found")
    }

    checkBoardAccess(board, req.user._id)   // ← here, after tracing card → list → board

    const cardDelete = await Card.findByIdAndDelete(cardId)

    return res
    .status(200)
    .json(new ApiResponse(200,{},"Card deleted successfully"))
})


// const deleteCard = asyncHandler(async(req,res) => {
//     const {cardId} = req.params

//     if(!isValidObjectId(cardId)){
//         throw new ApiError(400,"Invalid card id")
//     }

//     const cardDelete = await Card.findByIdAndDelete(cardId)

//     if(!cardDelete){
//         throw new ApiError(404,"Card not found")
//     }

//     return res
//     .status(200)
//     .json(new ApiResponse(200,{},"Card deleted successfully"))
// })

export{
    createCard,
    updateCard,
    getAllCardsFromTheList,
    deleteCard
}