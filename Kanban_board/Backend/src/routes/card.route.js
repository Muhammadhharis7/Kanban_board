import {Router} from "express"
import { createCard, deleteCard, getAllCardsFromTheList, updateCard } from "../controllers/card.controller.js"

const router = Router()

// Create card & get all cards from the list
router.route("/").post(createCard).get(getAllCardsFromTheList)


// Update card & delete card
router.route("/:boardId").patch(updateCard).delete(deleteCard)

export default router