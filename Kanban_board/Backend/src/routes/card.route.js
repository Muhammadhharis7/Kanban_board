import {Router} from "express"
import { createCard, deleteCard, getAllCardsFromTheList, updateCard } from "../controllers/card.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/").post(verifyJWT, createCard)

router.route("/list/:listId").get(verifyJWT, getAllCardsFromTheList)

router.route("/:cardId").patch(verifyJWT, updateCard).delete(verifyJWT, deleteCard)

export default router







// import {Router} from "express"
// import { createCard, deleteCard, getAllCardsFromTheList, updateCard } from "../controllers/card.controller.js"

// const router = Router()

// // Create card & get all cards from the list
// router.route("/").post(createCard)

// router.route("/list/:listId").get(getAllCardsFromTheList)

// // Update card & delete card
// router.route("/:cardId").patch(updateCard).delete(deleteCard)

// export default router
