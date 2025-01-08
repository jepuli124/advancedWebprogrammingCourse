import {Request, Response, Router} from "express"
import { body, Result, ValidationError, validationResult } from 'express-validator'
import path from "path";
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { validateToken, validateTokenAdmin } from '../middleware/validate-config'
import {IUser, User} from './models/User'
import {ITopic, Topic} from './models/Topic'

const router: Router = Router()

function setup(){
    
    }

router.post('/api/user/register', body("username").trim().isLength({min: 3, max:25}).escape(), body("password").trim().isStrongPassword().escape(), body("email").trim().isEmail().escape(), async (req: any, res: any) => {
    const errors: Result<ValidationError> = validationResult(req)
    if(!errors.isEmpty()) {
        console.log(errors);
        return res.status(400).json({errors: errors.array()})
    }
    
    try {
        let listOfUsers: IUser[] | null = await User.find()
        for (let index = 0; index < listOfUsers.length; index++) {
            if (req.body.email == listOfUsers[index].email){
                console.log("email already registered", req.body.email, listOfUsers[index].email)
                return res.status(403).json({msg: "Email already registered", email: "Email already in use"})
            };
        }

        const salt: string = bcrypt.genSaltSync(10, 'b');

        let password: string = bcrypt.hashSync(req.body.password, salt);
        let newUser = new User ({
            email: req.body.email,
            password: password,
            username: req.body.username,
            isAdmin: req.body.isAdmin
        })
        await newUser.save()
        res.status(200).json({
            email: req.body.email,
            password: password,
            username: req.body.username,
            isAdmin: req.body.isAdmin
        })
    } catch (error: any) {
        console.log(`Error in registery: ${error}`)
        return res.status(500).json({message: "Internal server error"})
    }
})


// router.get('/api/user/list', async (req: any, res: any) =>{ // copied from course source code 
//     try {
//         return res.status(200).json(listOfUsers)
//     } catch (error: any) {
//         console.log(`Error while fetching offers: ${error}`)
//         return res.status(500).json({message: "Internal server error"})
//     }
    
//     });

//
router.post('/api/user/login', body("password").trim().escape(), body("email").trim().isEmail().escape(), async (req: any, res: any) => {
    const errors: Result<ValidationError> = validationResult(req)

    if(!errors.isEmpty()) {
        console.log(errors);
        return res.status(400).json({errors: errors.array()})
    }
    try {
        let listOfUsers: IUser[] | null = await User.find()

        for (let index = 0; index < listOfUsers.length; index++) {
            if (req.body.email == listOfUsers[index].email){
                if(bcrypt.compareSync(req.body.password, listOfUsers[index].password)){
                    const payload: JwtPayload = {
                        _id: listOfUsers[index].id,
                        username: listOfUsers[index].username,
                        isAdmin: listOfUsers[index].isAdmin
                    }
                    const token: string = jwt.sign(payload, process.env.SECRET as string, { expiresIn: "1000m"})

                    return res.status(200).json({msg: "Login succsesful", token: token, username: listOfUsers[index].username})
                } else {
                    return res.status(401).json({msg: "Login failed"})
                }
            };
        }

        res.status(404).json({msg: `user not found`})
    } catch (error: any) {
        console.log(`Error while login: ${error}`)
        return res.status(500).json({message: "Internal server error"})
    }
})


router.get('/api/topics', async (req: any, res: any) => { 
    try {
        let topics = await Topic.find()
        console.log("Topics", topics)
        res.status(200).json({topics})
    } catch (error: any) {
        console.log(`Error while get topics: ${error}`)
        return res.status(500).json({message: "Internal server error"})
    }
    });

router.post('/api/topic', validateToken, async (req: any, res: any) => { 
    try {
        console.log("adding topic", req.body)
        const token: string | undefined = req.header('authorization')?.split(" ")[1]
        if(!token) return res.status(401).json({message: "Missing token"})
        const arrayToken = token.split('.'); //https://medium.com/@feldjesus/how-to-decode-a-jwt-token-175305335024 
        const tokenPayload = JSON.parse(atob(arrayToken[1]));
        let newTopic = new Topic ({
            title: req.body.title,
            content: req.body.content,
            username: tokenPayload.username,
            createdAt: Date()
        })
        await newTopic.save()
        res.status(200).json({
            title: req.body.title,
            content: req.body.content,
            username: tokenPayload.username,
            createdAt: Date()
        })
    } catch (error: any) {
        console.log(`Error while get topics: ${error}`)
        return res.status(500).json({message: "Internal server error"})
    }
    });

router.delete('/api/topic/:id', validateTokenAdmin, async (req: any, res: any) => { 

    try {
        let topic: ITopic[] | undefined = await Topic.find({_id: req.params['id']})
        if(topic.length == 0){
            return res.status(404).json({message: "Element not found"})
        } 
        await Topic.deleteOne({_id: req.params['id']})
        return res.status(200).json({message: "Topic deleted successfully."})
    } catch (error: any) {
        console.log(`Error while get topics: ${error}`)
        return res.status(500).json({message: "Internal server error"})
    }
    });

// router.get('/api/secret', validateToken, async (req: any, res: any) =>{ // copied from course source code 
//     try {
//         return res.status(200).json({message: "This is protected secure route!"})
        
//     } catch (error: any) {
//         console.log(`Error while fetching offers: ${error}`)
//         return res.status(500).json({message: "Internal server error"})
//     }
    
//     });

// router.get('/api/private', validateToken, async (req: any, res: any) =>{ // copied from course source code 
//     try {
//         return res.status(200).json({message: "This is protected secure route!"})
        
//     } catch (error: any) {
//         console.log(`Error while fetching offers: ${error}`)
//         return res.status(500).json({message: "Internal server error"})
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