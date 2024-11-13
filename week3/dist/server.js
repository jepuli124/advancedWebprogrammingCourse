"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json()); //parses the incoming post body
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
let list = [];
app.get('/hello', (req, res) => {
    res.send({ msg: "Hello world" });
});
app.get('/echo/:id', (req, res) => {
    res.send({ id: req.params["id"] });
});
app.post('/sum', (req, res) => {
    var sum = 0;
    for (let index = 0; index < req.body.numbers.length; index++) {
        sum += req.body.numbers[index];
    }
    res.send({ sum: sum });
});
app.post('/users', (req, res) => {
    let user = {
        name: req.body.name,
        email: req.body.email
    };
    list.push(user);
    res.send({ msg: "User successfully added" });
});
app.get('/users', (req, res) => {
    //console.log("get users" + JSON.stringify(list))
    //res.sendStatus(201)//.json(list);     // https://stackabuse.com/bytes/how-to-return-status-codes-in-express/
    res.status(201).json(JSON.stringify({ list: list }));
});
app.listen(port, () => {
    console.log(`hello world ${port}`);
});
// http.createServer(function(req, res) {
//     res.write("Hello world");
//     res.end();
// }).listen(port);
