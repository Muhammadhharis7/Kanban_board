import {Router} from "express"
import {createList, deleteList, getAllListFromTheBoard, updateList} from "../controllers/list.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/").post(verifyJWT, createList)

router.route("/board/:boardId").get(verifyJWT, getAllListFromTheBoard)

router.route("/:listId").patch(verifyJWT, updateList).delete(verifyJWT, deleteList)

export default router







// import {Router} from "express"
// import {createList, deleteList, getAllListFromTheBoard, updateList} from "../controllers/list.controller.js"

// const router = Router()

// // Create List & get all list from the board
// router.route("/").post(createList)

// router.route("/board/:boardId").get(getAllListFromTheBoard)

// // Update list and delete list
// router.route("/:listId").patch(updateList).delete(deleteList)

// export default router