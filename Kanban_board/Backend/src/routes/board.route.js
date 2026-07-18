import {Router} from "express"
import {createBoard, deleteBoard, getAllBoards, getOneBoard, updateBoard} from "../controllers/board.controller.js"

const router = Router()

// Create board
router.route("/").post(createBoard).get(getAllBoards)

// Get  all boards
// router.route("/").get(getAllBoards)

// Update board
router.route("/:boardId").get(getOneBoard).patch(updateBoard).delete(deleteBoard)

// Get one board
// router.route("/:boardId").put(getOneBoard)

// Delete board
// router.route("/:boardId").delete(deleteBoard)

export default router