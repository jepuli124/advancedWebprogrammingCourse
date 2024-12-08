import {Request, Response, Router} from "express"
import path from "path";
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { validateToken } from '../middleware/validate-config'

const router: Router = Router()

type TUser = {
    email: string
    password: string
}

let listOfUsers: TUser[] = []

function setup(){
    
    }

router.post('/api/user/register', async (req: any, res: any) => {
    try {
        
        for (let index = 0; index < listOfUsers.length; index++) {
            if (req.body.email == listOfUsers[index].email){
                console.log("email already registered", req.body.email, listOfUsers[index].email)
                return res.status(403).json({msg: "Email already registered"})
            };
        }
        
        

        const salt: string = bcrypt.genSaltSync(10, 'b');
        console.log(req.body.email, req.body.password, req.body, salt)
        let password: string = bcrypt.hashSync(req.body.password, salt);
        const newUser: TUser = {
            email: req.body.email,
            password: password
        }
        listOfUsers.push(newUser)
        res.status(200).json({email: newUser.email, password: newUser.password})
    } catch (error: any) {
        console.log(`Error in registery: ${error}`)
        return res.status(500).json({message: "Internal server error"})
    }
})


router.get('/api/user/list', async (req: any, res: any) =>{ // copied from course source code 
    try {
        return res.status(200).json(listOfUsers)
    } catch (error: any) {
        console.log(`Error while fetching offers: ${error}`)
        return res.status(500).json({message: "Internal server error"})
    }
    
    });


router.post('/api/user/login', async (req: any, res: any) => {
    try {
        console.log(req.body, listOfUsers)
        for (let index = 0; index < listOfUsers.length; index++) {
            if (req.body.email == listOfUsers[index].email && bcrypt.compareSync(req.body.password, listOfUsers[index].password)){
                const payload: JwtPayload = {
                    email: listOfUsers[index].email
                }
                const token: string = jwt.sign(payload, process.env.SECRET as string, { expiresIn: "1000m"})
                return res.status(200).json({msg: "Login succsesful", token: token})
            };
        }

        res.status(403).json({msg: `login failed `})
    } catch (error: any) {
        console.log(`Error while uploading offers: ${error}`)
        return res.status(500).json({message: "Internal server error"})
    }
})

router.get('/api/secret', validateToken, async (req: any, res: any) =>{ // copied from course source code 
    try {
        return res.status(200).json({message: "This is protected secure route!"})
        
    } catch (error: any) {
        console.log(`Error while fetching offers: ${error}`)
        return res.status(500).json({message: "Internal server error"})
    }
    
    });

router.get('/api/private', validateToken, async (req: any, res: any) =>{ // copied from course source code 
    try {
        return res.status(200).json({message: "This is protected secure route!"})
        
    } catch (error: any) {
        console.log(`Error while fetching offers: ${error}`)
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

// router.put('/update', async (req: any, res: any) =>{
//     try { //template from source code
//         const user: IUser | null = await User.findOne({name: req.body.name})
//         if (!user) {
//             return res.status(404).json({message: "No user found"})
//         }
//         let TodoExist: Boolean = false
//         let newTodos: ITodo[] = []
//         for (let counter = 0; counter < user.todos.length; counter++) {
//             if (req.body.todo == user.todos[counter].todo){
//                 TodoExist = true
//             }else{
//                 newTodos.push(new Todo({ todo: user.todos[counter].todo}))
//             }
            
//         }
//         if(!TodoExist){
//             // writeToFile()
//             console.log("Todo not found, Update todos:", newTodos)
//             res.send({msg: "Todo not found"})
//         } else {
//             console.log("Todo found, Update todos:", newTodos)
//             user.todos = newTodos

//             await user.save()
//             // writeToFile()
//             res.send({msg: "Todo deleted successfully."})
//         }
//     } catch (error: any) {
//         console.log(`Error while fetching in update: ${error}`)
//         return res.status(500).json({message: "Internal server error"})
//     }
//     });
    
//     router.put('/updateTodo', async (req: any, res: any) =>{
//         try { //template from source code
//             const user: IUser | null = await User.findOne({name: req.body.name})
//             if (!user) {
//                 return res.status(404).json({message: "No user found"})
//             }
//             let TodoExist: Boolean = false
            
//             console.log("Update Todo incoming body", req.body)

//             for (let counter = 0; counter < user.todos.length; counter++) {
//                 if (req.body.todo == user.todos[counter].todo){
//                     TodoExist = true
//                     user.todos[counter].checked = req.body.checked
//                 }
//             }
//             if(!TodoExist){

//                 res.send({msg: "Todo not found"})
//             } else {
    
//                 await user.save()
//                 res.send({msg: "Todo checked successfully."})
//             }
//         } catch (error: any) {
//             console.log(`Error while fetching in update: ${error}`)
//             return res.status(500).json({message: "Internal server error"})
//         }
//         });


setup()


export default router