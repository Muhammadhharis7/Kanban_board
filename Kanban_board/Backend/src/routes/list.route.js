import {Router} from "express"
import {createList, deleteList, getAllListFromTheBoard, updateList} from "../controllers/list.controller.js"

const router = Router()

// Create List & get all list from the board
router.route("/").post(createList).get(getAllListFromTheBoard)

// Update list and delete list
router.route("/:boardId").patch(updateList).delete(deleteList)

export default router