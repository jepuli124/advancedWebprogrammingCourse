import express, {Express, json, Router} from "express";
import path from "path";
import router from "./src/index";
import mongoose, { Connection } from 'mongoose'
import dotenv from "dotenv"

dotenv.config()

const app: Express = express()
const port = 3000  

const mongoDB: string = "mongodb://127.0.0.1:27017/testdb"
mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db: Connection = mongoose.connection

db.on("error", console.error.bind(console, "apua lol"))


app.use(express.json()); //parses the incoming post body
app.use(express.static(path.join(__dirname, "../public")))
app.use("/", router)



app.listen(port, () => {
    console.log(`hello world ${port}`);
})
 
