import express, {Express, json, Router} from "express"
import path from "path";
import router from "./src/index";

const app: Express = express()
const port = 3000 

app.use(express.json()); //parses the incoming post body
app.use(express.static(path.join(__dirname, "../public")))
app.use("/", router)

//const http = require("http");

//console.log("hello world");

type TUser = 
    {
        name: string,
        email: string
    }
let users: TUser[] = [];

app.get('/hello', (req, res) =>{
    res.send({msg: "Hello world!"})
});

app.get('/echo/:id', (req, res) =>{
    res.send({id: req.params["id"]})
});

app.post('/sum', (req, res) => {
    var sum = 0;
    for (let index = 0; index < req.body.numbers.length; index++) {
        sum += req.body.numbers[index];
        
    }
    res.send({sum: sum})
});

app.post('/users', (req, res) => {
    let user: TUser = {
        name: req.body.name,
        email: req.body.email
    }
    console.log("user: ", user)
    users.push(user);
    res.send({message : "User successfully added"})
});

app.get('/users', (req, res) =>{
    //console.log("get users" + JSON.stringify(list))
    //res.sendStatus(201)//.json(list);     // https://stackabuse.com/bytes/how-to-return-status-codes-in-express/
    console.log("list of users: ", users)
    res.status(201).json({users: users});
    
});

app.listen(port, () => {
    console.log(`hello world ${port}`);
})

// http.createServer(function(req, res) {

//     res.write("Hello world");
//     res.end();
// }).listen(port);