"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
let users = [];
router.post('/add', (req, res) => {
    let UserExist = false;
    for (let index = 0; index < users.length; index++) {
        if (req.body.name == users[index].name) {
            console.log(users[index].todos);
            users[index].todos.push(req.body.todos);
            UserExist = true;
            break;
        }
    }
    if (!UserExist) {
        let newUser = {
            name: req.body.name,
            todos: [req.body.todos]
        };
        users.push(newUser);
    }
    res.send({ msg: `Todo added successfully for user ${req.body.name}` });
});
router.get('/todo/:id', (req, res) => {
    let UserExist = false;
    for (let index = 0; index < users.length; index++) {
        if (req.params["id"] == users[index].name) {
            res.send({ todos: users[index].todos });
            UserExist = true;
            break;
        }
    }
    if (!UserExist) {
        res.send({ msg: "User not found" });
    }
});
router.get('/user/:id', (req, res) => {
    let UserExist = false;
    for (let index = 0; index < users.length; index++) {
        if (req.params["id"] == users[index].name) {
            res.send({ todos: users[index].todos });
            UserExist = true;
            break;
        }
    }
    if (!UserExist) {
        res.send({ msg: "User not found" });
    }
});
router.delete('/delete', (req, res) => {
    let UserExist = false;
    let newUsers = [];
    for (let index = 0; index < users.length; index++) {
        if (req.body.name == users[index].name) {
            res.send({ msg: "User deleted successfully." });
            UserExist = true;
        }
        else {
            newUsers.push(users[index]);
        }
    }
    if (!UserExist) {
        res.send({ msg: "User not found" });
    }
    else {
        users = newUsers;
    }
});
router.put('/update', (req, res) => {
    let UserExist = false;
    let TodoExist = false;
    let newTodos = [];
    for (let index = 0; index < users.length; index++) {
        if (req.body.name == users[index].name) {
            for (let counter = 0; counter < users[index].todos.length; counter++) {
                if (req.body.todo == users[index].todos[counter]) {
                    res.send({ msg: "Todo deleted successfully." });
                    TodoExist = true;
                }
                else {
                    newTodos.push(users[index].todos[counter]);
                }
            }
            if (!TodoExist) {
                res.send({ msg: "Todo not found" });
                return;
            }
            users[index].todos = newTodos;
            UserExist = true;
            break;
        }
    }
    if (!UserExist) {
        res.send({ msg: "User not found" });
    }
});
// router.get('/hello', (req, res) =>{
//     res.send({msg: "Hello world!"})
// });
// router.get('/echo/:id', (req, res) =>{
//     res.send({id: req.params["id"]})
// });
// router.post('/sum', (req, res) => {
//     var sum = 0;
//     for (let index = 0; index < req.body.numbers.length; index++) {
//         sum += req.body.numbers[index];
//     }
//     res.send({sum: sum})
// });
// router.post('/users', (req, res) => {
//     let user: TUser = {
//         name: req.body.name,
//         email: req.body.email
//     }
//     console.log("user: ", user.name)
//     users.push(user);
//     res.send({message : "User successfully added"})
// });
// router.get('/users', (req, res) =>{
//     //console.log("get users" + JSON.stringify(list))
//     //res.sendStatus(201)//.json(list);     // https://stackabuse.com/bytes/how-to-return-status-codes-in-express/
//     console.log("list of users: ", users)
//     res.status(201).json({users: users});
// });
exports.default = router;
