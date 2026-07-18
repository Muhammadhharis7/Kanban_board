import {Router} from "express"
import {createList, deleteList, getAllListFromTheBoard, updateList} from "../controllers/list.controller.js"

const router = Router()

// Create List & get all list from the board
router.route("/").post(createList)

router.route("/board/:boardId").get(getAllListFromTheBoard)

// Update list and delete list
router.route("/:listId").patch(updateList).delete(deleteList)

export default router