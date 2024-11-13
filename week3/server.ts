import express, {Express, json} from "express"
import path from "path";

const app: Express = express()
const port = 3000 

app.use(express.json()); //parses the incoming post body
app.use(express.static(path.join(__dirname, "../public")))

//const http = require("http");

//console.log("hello world");

type TUser = 
    {
        name: string,
        email: string
    }
let list: TUser[] = [];

app.get('/hello', (req, res) =>{
    res.send({msg: "Hello world"})
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
    list.push(user);
    res.send({msg : "User successfully added"})
});

app.get('/users', (req, res) =>{
    //console.log("get users" + JSON.stringify(list))
    //res.sendStatus(201)//.json(list);     // https://stackabuse.com/bytes/how-to-return-status-codes-in-express/
    res.status(201).json(JSON.stringify({list: list}));
    
});

app.listen(port, () => {
    console.log(`hello world ${port}`);
})

// http.createServer(function(req, res) {

//     res.write("Hello world");
//     res.end();
// }).listen(port);