"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("./models/User");
const router = (0, express_1.Router)();
// type TUser = 
//     {
//         name: string,
//         todos: ITodo[]
//     }
// let users: TUser[] = [];
function setup() {
}
// function writeToFile(){
//     try { //https://nodejs.org/api/fs.html#fspromisesreadfilepath-options
//         const filePath = path.resolve('./data.json');
//         fs.writeFile(filePath, JSON.stringify(users),  'utf8' , (err) => {});
//       } catch (err) {
//         console.log(err);
//       }
//     }
// async function readFromFile(){
//     try { //https://nodejs.org/api/fs.html#fspromisesreadfilepath-options
//         const filePath = path.resolve('./data.json');
//         fs.readFile(filePath, {encoding: 'utf8'}, (err, data) => {
//             users = JSON.parse(data)
//         });
//       } catch (err) {
//         console.log(err);
//       }
//     }
router.post('/add', async (req, res) => {
    let UserExist = false;
    try {
        const users = await User_1.User.find();
        for (let index = 0; index < users.length; index++) {
            if (req.body.name == users[index].name) {
                await User_1.User.deleteOne({ User: users[index].name });
                const newUser = new User_1.User({
                    name: req.body.name,
                    todos: []
                });
                for (let counter = 0; counter < req.body.todos.length; counter++) {
                    newUser.todos.push(new User_1.Todo({ todo: users[index].todos[counter].todo }));
                }
                for (let counter = 0; counter < req.body.todos.length; counter++) {
                    newUser.todos.push(new User_1.Todo({ todo: req.body.todos[counter] }));
                }
                console.log("existing user", newUser, " Todos:");
                await newUser.save();
                UserExist = true;
                break;
            }
        }
        if (!UserExist) {
            const newTodo = new User_1.Todo({
                todo: req.body.todos,
                checked: false
            });
            const newUser = new User_1.User({
                name: req.body.name,
                todos: [newTodo]
            });
            console.log("New user", newUser);
            await newUser.save();
        }
        // writeToFile()
        res.send({ msg: `Todo added successfully for user ${req.body.name}` });
    }
    catch (error) {
        console.log(`Error while fetching users in add: ${error}`);
        return res.status(500).json({ message: "Internal server error" });
    }
});
router.get('/todos/:id', async (req, res) => {
    try {
        const users = await User_1.User.find();
        if (!users) {
            return res.status(404).json({ message: "No user found" });
        }
        let UserExist = false;
        for (let index = 0; index < users.length; index++) {
            if (req.params["id"] == users[index].name) {
                console.log("User todos:", users[index].todos);
                res.json({ user: req.params["id"], todos: users[index].todos });
                UserExist = true;
                break;
            }
        }
        if (!UserExist) {
            res.send({ msg: "User not found" });
        }
    }
    catch (error) {
        console.log(`Error while fetching users in todos id: ${error}`);
        return res.status(500).json({ message: "Internal server error" });
    }
});
// router.get('/users/:id', (req, res) =>{  // codegrade and task instructions differ so this is to fix that 
//     let UserExist: Boolean = false
//     for (let index = 0; index < users.length; index++) {
//         if (req.params["id"] == users[index].name){
//             res.json({user: req.params["id"], todos: users[index].todos})
//             UserExist = true
//             break;
//         }   
//     }
//     if (!UserExist){
//         res.send({msg: "User not found"})
//     }
//     });
// router.delete('/delete', (req, res) =>{
//     let UserExist: Boolean = false
//     let newUsers: TUser[] = [];
//     for (let index = 0; index < users.length; index++) {
//         if (req.body.name == users[index].name){
//             UserExist = true
//         } else {
//             newUsers.push(users[index])
//         } 
//     }
//     if (!UserExist){
//         res.send({msg: "User not found"})
//     } else {
//         // writeToFile()
//         users = newUsers
//         res.send({msg: "User deleted successfully."})
//     }
//     });
router.put('/update', async (req, res) => {
    try { //template from source code
        const users = await User_1.User.find();
        if (!users) {
            return res.status(404).json({ message: "No user found" });
        }
        let UserExist = false;
        let TodoExist = false;
        let newTodos = [];
        for (let index = 0; index < users.length; index++) {
            if (req.body.name == users[index].name) {
                for (let counter = 0; counter < users[index].todos.length; counter++) {
                    if (req.body.todo == users[index].todos[counter]) {
                        TodoExist = true;
                    }
                    else {
                        newTodos.push(new User_1.Todo({ todo: users[index].todos[counter].todo }));
                    }
                }
                if (!TodoExist) {
                    // writeToFile()
                    res.send({ msg: "Todo not found" });
                }
                else {
                    await User_1.User.deleteOne({ User: users[index].name });
                    const newUser = new User_1.User({
                        name: users[index].name,
                        todos: newTodos
                    });
                    await newUser.save();
                    UserExist = true;
                    // writeToFile()
                    res.send({ msg: "Todo deleted successfully." });
                }
            }
        }
        if (!UserExist) {
            res.send({ msg: "User not found" });
        }
    }
    catch (error) {
        console.log(`Error while fetching in update: ${error}`);
        return res.status(500).json({ message: "Internal server error" });
    }
});
setup();
exports.default = router;
