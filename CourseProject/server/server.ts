import express, {Express, json, Router} from "express";
import path from "path";
import router from "./src/index";
import mongoose, { Connection } from 'mongoose'
import dotenv from "dotenv"
import cors, {CorsOptions} from 'cors'

// all code in this file is from cource's source code 

dotenv.config() // .env file handling library

const app: Express = express() //express initization
const port = 1234  

const mongoDB: string = "mongodb://127.0.0.1:27017/testdb" // database connection
mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db: Connection = mongoose.connection

db.on("error", console.error.bind(console, "apua lol"))

app.use(express.json()); //parses the incoming post body
//app.use(express.static(path.join(__dirname, "../public")))
app.use("/", router)

if(process.env.NODE_ENV === 'development'){ //dev mode
    const corsOptions: CorsOptions = {
        origin: 'http://localhost:1234',
        optionsSuccessStatus: 200
    }
    
    app.use(cors(corsOptions))
} else if (process.env.NODE_ENV === 'production') { // client mode
    app.use(express.static(path.resolve('../..', 'client', 'build')))
    app.get('*', (req: any, res: any) => {
        res.sendFile(path.resolve('../..', 'client', 'build', 'index.html'))
    })
}


app.listen(port, () => {
    console.log(`hello world ${port}`);
})
 