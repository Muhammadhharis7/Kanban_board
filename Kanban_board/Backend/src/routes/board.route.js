import {Router} from "express"
import {createBoard, deleteBoard, getAllBoards, getOneBoard, updateBoard} from "../controllers/board.controller.js"
import {verifyJWT} from  "../middlewares/auth.middleware.js"

const router = Router()

// Create board
router.route("/").post(verifyJWT,createBoard).get(verifyJWT,getAllBoards)

// Update board
router.route("/:boardId").get(verifyJWT,getOneBoard).patch(verifyJWT,updateBoard).delete(verifyJWT,deleteBoard)


export default router