import {Request, Response, Router} from "express"
import fs from "fs"
import path from "path";

const router: Router = Router()

type TUser = 
    {
        name: string,
        todos: string[]
    }

let users: TUser[] = [];


function setup(){
    try {
        fs.open("./data.json", "r", (err, fd) => {
            if(err !== null){
                fs.open("./data.json", "wx", (err, fd) => {
                    if(fd !== undefined){
                        fs.close(fd)
                    }
                })
            } else {
                readFromFile()
                console.log("File found")
            }
            if(fd !== undefined){
                fs.close(fd)
            }
            
        }) 
    } catch (error) {
        console.log("File not found")
    }
    
    }

function writeToFile(){
    try { //https://nodejs.org/api/fs.html#fspromisesreadfilepath-options
        const filePath = path.resolve('./data.json');
        fs.writeFile(filePath, JSON.stringify(users),  'utf8' , (err) => {});
      } catch (err) {
        console.log(err);
      }
    }

async function readFromFile(){
    try { //https://nodejs.org/api/fs.html#fspromisesreadfilepath-options
        const filePath = path.resolve('./data.json');
        fs.readFile(filePath, {encoding: 'utf8'}, (err, data) => {
            users = JSON.parse(data)
        });
      } catch (err) {
        console.log(err);
      }
    }



router.post('/add', (req, res) => {
    let UserExist: Boolean = false
    for (let index = 0; index < users.length; index++) {
        if (req.body.name == users[index].name){
            users[index].todos.push(req.body.todos)
            UserExist = true
            break;
        }   
    } 
    if (!UserExist){
        let newUser: TUser = {
            name: req.body.name,
            todos: [req.body.todos]
        } 
        users.push(newUser)
    }
    writeToFile()
    res.send({msg: `Todo added successfully for user ${req.body.name}`})
    }); 
router.get('/todos/:id', (req, res) =>{
    let UserExist: Boolean = false
    for (let index = 0; index < users.length; index++) {
        if (req.params["id"] == users[index].name){

            res.json({user: req.params["id"], todos: users[index].todos})

            UserExist = true
            break;
        }   
    }
    if (!UserExist){
        res.send({msg: "User not found"})
    }
    });

router.get('/users/:id', (req, res) =>{  // codegrade and task instructions differ so this is to fix that 
    let UserExist: Boolean = false
    for (let index = 0; index < users.length; index++) {
        if (req.params["id"] == users[index].name){

            res.json({user: req.params["id"], todos: users[index].todos})

            UserExist = true
            break;
        }   
    }
    if (!UserExist){
        res.send({msg: "User not found"})
    }
    });
    

router.delete('/delete', (req, res) =>{
    let UserExist: Boolean = false
    let newUsers: TUser[] = [];
    for (let index = 0; index < users.length; index++) {
        if (req.body.name == users[index].name){
            UserExist = true
        } else {
            newUsers.push(users[index])
        } 
    }
    if (!UserExist){
        res.send({msg: "User not found"})
    } else {
        writeToFile()
        users = newUsers
        res.send({msg: "User deleted successfully."})
    }
    });

router.put('/update', (req, res) =>{
    let UserExist: Boolean = false 
    let TodoExist: Boolean = false
    let newTodos: string[] = [];
    for (let index = 0; index < users.length; index++) {
        if (req.body.name == users[index].name){
            for (let counter = 0; counter < users[index].todos.length; counter++) {
                if (req.body.todo == users[index].todos[counter]){
                    
                    TodoExist = true
                }else{
                    newTodos.push(users[index].todos[counter])
                }
                
            }
            if(!TodoExist){
                writeToFile()
                res.send({msg: "Todo not found"})
            } else {
                users[index].todos = newTodos
                UserExist = true
                writeToFile()
                res.send({msg: "Todo deleted successfully."})
            }
        } 
    }
    if (!UserExist){
        res.send({msg: "User not found"})
    } 
    });



setup()
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


export default router