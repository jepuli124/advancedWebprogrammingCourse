import {Request, Response, Router} from "express"
import path from "path";
import {IOffer, Offer} from './models/Offer'
import {IImage, Image} from './models/Image'
import upload from '../middleware/multer-config'

const router: Router = Router()




function setup(){
    
    }

router.post('/upload', upload.single("image"), async (req: any, res: any) => {
    try {
        let newOffer: IOffer
        if(req.file){
            const newImage: IImage = new Image({
                filename: req.file.filename,
                path: `images/${req.file.filename}`
            })
            await newImage.save() 
            newOffer = new Offer({
                title: req.body.title,
                description: req.body.description,
                price: req.body.price,
                imageId: newImage._id
            }) 
        } else {
            newOffer = new Offer({
                title: req.body.title, 
                description: req.body.description,
                price: req.body.price
            }) 
        }
        
        
        console.log("New offer", newOffer)
        await newOffer.save()
        res.status(201).json({msg: `successful operation in upload`})
    } catch (error: any) {
        console.log(`Error while uploading offers: ${error}`)
        return res.status(500).json({message: "Internal server error"})
    }
})


router.get('/offers', async (req: any, res: any) =>{ // copied from course source code 
    try {
        const offers: IOffer[] | null = await Offer.find()
        
        if (!offers) {
            return res.status(404).json({message: "No offers found"})
        }

        let returnOffers: {
            title: String,
            description: String,
            price: Number,
            imagePath?:  String
        }[] = [] 

        for (let index = 0; index < offers.length; index++) {
            let image: IImage | null = await Image.findById(offers[index].imageId)
            
            if (image !== null){
                returnOffers.push({
                    title: offers[index].title,
                    description: offers[index].description,
                    price: offers[index].price,
                    imagePath: image.path
                    })
            } else {
                returnOffers.push({
                    title: offers[index].title,
                    description: offers[index].description,
                    price: offers[index].price,
                    imagePath: undefined
                    })
                }
            }
        return res.status(200).json( returnOffers )
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