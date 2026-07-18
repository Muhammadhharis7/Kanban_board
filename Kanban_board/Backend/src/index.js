import connectDB from "../src/db/index.js"
import {app} from "./app.js"
import dotenv from "dotenv"

dotenv.config({
    path:"../../.env"
})


connectDB().then(() =>{
    app.listen(process.env.PORT,() => {
        console.log(`Server is listening on port ${process.env.PORT}`);
    })
}).catch((err) => {
    console.log("MongoDb connection failed : ", err);
})

