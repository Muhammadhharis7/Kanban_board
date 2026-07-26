// utils/checkBoardAccess.js
const checkBoardAccess = (board, userId) => {
    const isMember = board.members.some(m => m.toString() === userId.toString())
    const isOwner = board.owner.toString() === userId.toString()
    if (!isMember && !isOwner) {
        throw new ApiError(403, "You do not have access to this board")
    }
}

export {checkBoardAccess}