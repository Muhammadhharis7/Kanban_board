import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()
// Middleware setup
app.use(cors({
    origin:process.env.OCRS_ORIGIN,
    credentials:true
}))
// Allows server to understands the incoming requests with a JSON body
app.use(express.json({limit:"16kb"})) 

// Allows server to understand data sent as URL-encoded form data.
app.use(express.urlencoded({extended:true,limit:"16kb"}))

// Malke anything inside a folder accessible via URL
app.use(express.static("public"))

// Reads cookies sent by the browser on each request and populates "req.cookies" with them. (used for reading refresh token cookie during authentication)
app.use(cookieParser())

// Rotes import
import boardRouter from "../src/routes/board.route.js"
import listRouter from "../src/routes/list.route.js"
import cardRouter from "../src/routes/card.route.js"

// Routes declaration
app.use("/api/v1/boards",boardRouter)
app.use("/api/v1/lists",listRouter)
app.use("/api/v1/cards",cardRouter)



export {app};