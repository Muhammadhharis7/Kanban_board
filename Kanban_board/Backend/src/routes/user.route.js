import { Router } from "express"
import { changeCurrentUserPassword, getCurrentUser, logOutUser, loginUser, refreshAccessToken, registerUser, updateAvatarImage, updateUser } from "../controllers/user.controler.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

// router.route("/register").post(upload.fields({ name: "avatar", maxCount: 1 }),registerUser)

router.route("/register").post(
    upload.fields([{ name: "avatar", maxCount: 1 }]),
    registerUser
)

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT,logOutUser)

router.route("/update-user").patch(verifyJWT,updateUser)

router.route("/update-avatar-image").patch(verifyJWT,upload.fields([{ name: "avatar", maxCount: 1 }]),updateAvatarImage)

router.route("/change-password").patch(verifyJWT,changeCurrentUserPassword)

router.route("/get-current-user").get(verifyJWT,getCurrentUser)

router.route("/refresh-access-token").post(refreshAccessToken)


export default router;