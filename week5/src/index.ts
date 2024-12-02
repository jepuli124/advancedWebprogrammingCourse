import {Request, Response, Router} from "express"
import fs from "fs"
import path from "path";
import {User, IUser, Todo, ITodo} from './models/User'

const router: Router = Router()

// type TUser = 
//     {
//         name: string,
//         todos: ITodo[]
//     }

// let users: TUser[] = [];


function setup(){
    
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



router.post('/add', async (req: any, res: any) => {
    try {
        const user: IUser | null = await User.findOne({name: req.body.name})
        
        
        if (user == null){
            console.log("New user, New todo incoming: ", req.body.todo)
            const newTodo: ITodo = new Todo ({
                todo: req.body.todo,
                checked: false
            })
            const newUser: IUser = new User({
                name: req.body.name,
                todos: newTodo
            }) 
            console.log("New user", newUser)
            await newUser.save()
        } else {
            console.log("User exist, New todo incoming: ", req.body.todo)
            user.todos.push(new Todo ({todo: req.body.todo}));

            await user.save()
        }
        // writeToFile()
        res.send({msg: `Todo added successfully for user ${req.body.name}`})
    } catch (error: any) {
        console.log(`Error while fetching users in add: ${error}`)
        return res.status(500).json({message: "Internal server error"})
    }
    
    }); 
router.get('/todos/:id', async (req: any, res: any) =>{ // copied from course source code 
    try {
        const users: IUser[] | null = await User.find()
        if (!users) {
            return res.status(404).json({message: "No user found"})
        }
        let UserExist: Boolean = false
        for (let index = 0; index < users.length; index++) {
            if (req.params["id"] == users[index].name){
                console.log("User todos in id:", users[index].todos)
                let returnTodos: String[] = [];
                for (let counter = 0; counter < users[index].todos.length; counter++) {
                    returnTodos.push(users[index].todos[counter].todo);
                    
                }
                console.log("Return todos in id", returnTodos)
                res.json({user: req.params["id"], todos: returnTodos})

                UserExist = true
                break;
            }   
        }
        if (!UserExist){
            res.send({msg: "User not found"})
        }
    } catch (error: any) {
        console.log(`Error while fetching users in todos id: ${error}`)
        return res.status(500).json({message: "Internal server error"})
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

router.put('/update', async (req: any, res: any) =>{
    try { //template from source code
        const user: IUser | null = await User.findOne({name: req.body.name})
        if (!user) {
            return res.status(404).json({message: "No user found"})
        }
        let TodoExist: Boolean = false
        let newTodos: ITodo[] = []
        for (let counter = 0; counter < user.todos.length; counter++) {
            if (req.body.todo == user.todos[counter].todo){
                TodoExist = true
            }else{
                newTodos.push(new Todo({ todo: user.todos[counter].todo}))
            }
            
        }
        if(!TodoExist){
            // writeToFile()
            console.log("Todo not found, Update todos:", newTodos)
            res.send({msg: "Todo not found"})
        } else {
            console.log("Todo found, Update todos:", newTodos)
            user.todos = newTodos

            await user.save()
            // writeToFile()
            res.send({msg: "Todo deleted successfully."})
        }
    } catch (error: any) {
        console.log(`Error while fetching in update: ${error}`)
        return res.status(500).json({message: "Internal server error"})
    }
    });
    
    router.put('/updateTodo', async (req: any, res: any) =>{
        try { //template from source code
            const user: IUser | null = await User.findOne({name: req.body.name})
            if (!user) {
                return res.status(404).json({message: "No user found"})
            }
            let TodoExist: Boolean = false
            
            console.log("Update Todo incoming body", req.body)

            for (let counter = 0; counter < user.todos.length; counter++) {
                if (req.body.todo == user.todos[counter].todo){
                    TodoExist = true
                    user.todos[counter].checked = req.body.checked
                }
            }
            if(!TodoExist){

                res.send({msg: "Todo not found"})
            } else {
    
                await user.save()
                res.send({msg: "Todo checked successfully."})
            }
        } catch (error: any) {
            console.log(`Error while fetching in update: ${error}`)
            return res.status(500).json({message: "Internal server error"})
        }
        });


setup()


export default router