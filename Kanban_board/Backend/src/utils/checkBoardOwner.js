// utils/checkBoardOwner.js
import { ApiError } from "./ApiError.js"

const checkBoardOwner = (board, userId) => {
    const isOwner = board.owner.toString() === userId.toString()

    if (!isOwner) {
        throw new ApiError(403, "Only the board owner can perform this action")
    }
}

export { checkBoardOwner }