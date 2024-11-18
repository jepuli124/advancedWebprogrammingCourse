"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
let users = [];
router.get('/hello', (req, res) => {
    res.send({ msg: "Hello world!" });
});
router.get('/echo/:id', (req, res) => {
    res.send({ id: req.params["id"] });
});
router.post('/sum', (req, res) => {
    var sum = 0;
    for (let index = 0; index < req.body.numbers.length; index++) {
        sum += req.body.numbers[index];
    }
    res.send({ sum: sum });
});
router.post('/users', (req, res) => {
    let user = {
        name: req.body.name,
        email: req.body.email
    };
    console.log("user: ", user.name);
    users.push(user);
    res.send({ message: "User successfully added" });
});
router.get('/users', (req, res) => {
    //console.log("get users" + JSON.stringify(list))
    //res.sendStatus(201)//.json(list);     // https://stackabuse.com/bytes/how-to-return-status-codes-in-express/
    console.log("list of users: ", users);
    res.status(201).json({ users: users });
});
exports.default = router;
