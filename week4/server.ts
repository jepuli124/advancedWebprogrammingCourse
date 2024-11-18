import express, {Express, json, Router} from "express"
import path from "path";
import router from "./src/index";

const app: Express = express()
const port = 3000 

app.use(express.json()); //parses the incoming post body
app.use(express.static(path.join(__dirname, "../public")))
app.use("/", router)


app.listen(port, () => {
    console.log(`hello world ${port}`);
})
