import {Request, Response, Router} from "express"
import { body, Result, ValidationError, validationResult } from 'express-validator'
import path from "path";
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { validateToken, validateTokenAdmin } from '../middleware/validate-config'
import {ICard, Card} from './models/Card'
import { IUser, User } from "./models/User";
import { IComment, Comment } from "./models/comment";
import { IColumn, Column } from "./models/Column";
import { Date as MDate, SaveOptions} from 'mongoose'


const router: Router = Router()

function setup(){ // could be used to setup values and stuff, idk
    
    }

//These routes cause error if req and res are both in correct type like in source code, which can be removed by givin a promise with void.
// I dont know what that means but it follows <the "If TypeScript is not used or it is used badly (like continuous use of any type)" rule. 

router.post('/api/card', validateToken, async (req: Request, res: Response): Promise<void> => { // upload a card if authenticated
    
    try {

        let dateTime = new Date() //https://www.scaler.com/topics/typescript/typescript-date/

        const token: string | undefined = req.header('authorization')?.split(" ")[1] // getting the userid out of the payload,
        if(!token) {
            res.status(401).json({message: "Invalid token"})
            return
        }
        const arrayToken = token.split('.'); //https://medium.com/@feldjesus/how-to-decode-a-jwt-token-175305335024 
        const tokenPayload = JSON.parse(atob(arrayToken[1]));
        
        let column: IColumn | null | undefined = await Column.findOne({name: req.body.column, userId: tokenPayload.userId}) // find a column and check if it exist
        if(column == undefined || column == null){
            res.status(404).json({message: "Column not found"})
            return; // column is needed
        } 

        let cards: ICard[] | null | undefined = await Card.find({column: column._id}) // fetched for the index value which is used to sort these cards

        let newBook = new Card ({
            name: req.body.name,
            text: req.body.text,
            status: req.body.status,
            timeToComplete: req.body.timeToComplete,
            timeSpend: req.body.timeSpend,
            createTime: dateTime,
            column: column._id,
            index: cards.length,
            colour: req.body.colour
        })
        await newBook.save()
        res.status(200).json({ //returning the data to user for unknown reasons
            name: req.body.name,
            text: req.body.text,
            status: req.body.status,
            timeToComplete: req.body.timeToComplete,
            timeSpend: req.body.timeSpend,
            createTime: dateTime,
            column: column._id,
            index: cards.length,
            colour: req.body.colour
        })
    } catch (error: any) { // standard error catching
        console.log(`Error in entering a card: ${error}`)
        res.status(500).json({message: "Internal server error"})
    }
    return
})

router.post('/api/comment', validateToken, async (req: Request, res: Response): Promise<void> => { // upload a comment if authenticated
    
    try {
        const token: string | undefined = req.header('authorization')?.split(" ")[1] // getting the username out of the comment,
        if(!token) {
            res.status(401).json({message: "Invalid token"})
            return
        }
        const arrayToken = token.split('.'); //https://medium.com/@feldjesus/how-to-decode-a-jwt-token-175305335024 
        const tokenPayload = JSON.parse(atob(arrayToken[1]));


        let dateTime = new Date() // creation time
        let newComment = new Comment ({
            post: req.body.post,
            text: req.body.text,
            createdAt: dateTime,
            posterName: tokenPayload.username
        })
        await newComment.save()
        res.status(200).json({
            post: req.body.post,
            text: req.body.text,
            createdAt: dateTime,
            posterName: tokenPayload.username
        })
    } catch (error: any) { // standard error catching
        console.log(`Error in entering a comment: ${error}`)
        res.status(500).json({message: "Internal server error"})
    }
    return
})

router.post('/api/column', validateToken, async (req: Request, res: Response): Promise<void> => { // upload a column if authenticated
    
    try {
        if(!req.body.name){ // column has to have name
            res.status(401).json({message: "Invalid column name"})
            return
        }
        const token: string | undefined = req.header('authorization')?.split(" ")[1] 
        if(!token) {
            res.status(401).json({message: "Invalid token"})
            return
        }
        const arrayToken = token.split('.'); //https://medium.com/@feldjesus/how-to-decode-a-jwt-token-175305335024 
        const tokenPayload = JSON.parse(atob(arrayToken[1])); // getting userId out of the session token token

        let newComment = new Column ({
            name: req.body.name,
            userId: tokenPayload.userId
        })
        await newComment.save()
        res.status(200).json({
            name: req.body.name,
            userId: tokenPayload.userId
        })
    } catch (error: any) {
        console.log(`Error in entering a column: ${error}`)
        res.status(500).json({message: "Internal server error"})
    }
    return
})

router.get('/api/cards', validateTokenAdmin, async (req: Request, res: Response): Promise<void> => { // return all cards if authenticated as admin 

    try { 
        let cards: ICard[] | null | undefined = await Card.find()
        if(cards == undefined || cards == null){
            res.status(404).json({message: "Cards not found"})
            return; // prevents errors ; might be unnecessary
        } 

        res.status(200).json(cards)
    } catch (error: any) {
        console.log(`Error while get all cards: ${error}`)
        res.status(500).json({message: "Internal server error"})
    }
    return
    });

router.get('/api/columns', validateTokenAdmin, async (req: Request, res: Response): Promise<void> => { // return all columns if authenticated as admin.

    try { 
        let columns: IColumn[] | null | undefined = await Column.find()
        if(columns == undefined || columns == null){
            res.status(404).json({message: "Columns not found"})
            return; // very necessary
        } 

        res.status(200).json(columns)
    } catch (error: any) {
        console.log(`Error while get all columns: ${error}`)
        res.status(500).json({message: "Internal server error"})
    }
    return
    });

router.get('/api/comments', validateTokenAdmin, async (req: Request, res: Response): Promise<void> => { // return all comments if authenticated as admin.

    try { 
        let comments: IComment[] | null | undefined = await Comment.find()
        if(comments == undefined || comments == null){
            res.status(404).json({message: "Comments not found"})
            return; // very not good
        } 

        res.status(200).json(comments)
    } catch (error: any) {
        console.log(`Error while get all comments: ${error}`)
        res.status(500).json({message: "Internal server error"})
    }
    return
    });

router.get('/api/users', validateTokenAdmin, async (req: Request, res: Response): Promise<void> => { // return all users if authenticated as admin.

    try { 
        let users: IUser[] | null | undefined = await User.find()
        if(users == undefined || users == null){
            res.status(404).json({message: "Users not found"})
            return; 
        } 

        res.status(200).json(users)
    } catch (error: any) {
        console.log(`Error while get all users: ${error}`)
        res.status(500).json({message: "Internal server error"})
    }
    return
    });

router.get('/api/columnByUser', validateToken, async (req: Request, res: Response): Promise<void> => { // return all column by user if authenticated 

    try { 
        const token: string | undefined = req.header('authorization')?.split(" ")[1]
        if(!token) {
            res.status(401).json({message: "Invalid token"})
            return
        }
        const arrayToken = token.split('.'); //https://medium.com/@feldjesus/how-to-decode-a-jwt-token-175305335024 
        const tokenPayload = JSON.parse(atob(arrayToken[1])); // reading the userId out of the session token.

        let columns: IColumn[] | null | undefined = await Column.find({userId: tokenPayload.userId})
        if(columns == undefined || columns == null){
            res.status(404).json({message: "Columns not found"})
            return; // very necessary
        } 

        res.status(200).json(columns)
    } catch (error: any) {
        console.log(`Error while get all columns: ${error}`)
        res.status(500).json({message: "Internal server error"})
    }
    return
    });
router.post('/api/cardsByColum', validateToken, async (req: Request, res: Response): Promise<void> => { // return all cards by column if authenticated

    try {
        let cards: ICard[] | null | undefined = await Card.find({column: req.body.columnId})
        if(cards == undefined || cards == null){
            res.status(404).json({message: "Element not found"})
            return;
        } 

        res.status(200).json(cards)
    } catch (error: any) {
        console.log(`Error while get all cards: ${error}`)
        res.status(500).json({message: "Internal server error"})
    }
    return
    });

router.post('/api/commentsByCard', validateToken, async (req: Request, res: Response): Promise<void> => { // return all comments by card's id if authenticated

    try {
        let comments: IComment[] | null | undefined = await Comment.find({post: req.body.commentRelatedId})
        if(comments == undefined || comments == null){
            res.status(404).json({message: "Element not found"})
            return;
        } 

        res.status(200).json(comments)
    } catch (error: any) {
        console.log(`Error while get all cards: ${error}`)
        res.status(500).json({message: "Internal server error"})
        
    }
    return
    });

router.get('/api/card/:card', validateToken, async (req: Request, res: Response): Promise<void> => {  // get specific card through params, currently not used

    try {
        let card: ICard | null | undefined = await Card.findOne({name: req.params['card']})
        if(card == undefined || card == null){
            res.status(404).json({message: "Element not found"})
            return
        } 
        console.log("card found", card)
        res.status(200).json(card)
    } catch (error: any) {
        console.log(`Error while get a card: ${error}`)
        res.status(500).json({message: "Internal server error"})
    }
    return
    });

router.post('/api/validateToken', validateToken, async (req: Request, res: Response): Promise<void> => {  // get session token validated to bypass login faster 

    try {
        res.status(200).json({message: "proceed"})
    } catch (error: any) {
        console.log(`Error while get a card: ${error}`)
        res.status(500).json({message: "Internal server error"})
    }
    return
    });

router.get('/api/validateTokenAdmin', validateTokenAdmin, async (req: Request, res: Response): Promise<void> => {  // get session token validated to bypass login faster (admin edition)

    try {
        res.status(200).json({message: "proceed"})
    } catch (error: any) {
        console.log(`Error while get a card: ${error}`)
        res.status(500).json({message: "Internal server error"})
    }
    return
    });

router.post('/api/register', async (req: Request, res: Response): Promise<void> => {  // register

    try {
        const listOfUsers = await User.find()
        for (let index = 0; index < listOfUsers.length; index++) { // checking that username is unique, not necessary but I thought it was a nice feature 
            if (req.body.name == listOfUsers[index].username){
                console.log("Username already registered", req.body.name, listOfUsers[index].username)
                res.status(403).json({msg: "Username already registered"})
                return
            };
        }
        
        const salt: string = bcrypt.genSaltSync(10, 'b'); // password encryption process, taken from course's source codes. 
        let password: string = bcrypt.hashSync(req.body.password, salt);

        let admin: boolean = false
        if(req.body.isAdmin){ //req.body.isAdmin is either "on" or null, so this changes it to boolean
            admin = true
        }

        const newUser = new User ({
            username: req.body.name,
            password: password,
            admin: admin
        })
        await newUser.save()

        const payLoadInfo: IUser | null = await User.findOne({username: req.body.name}) //need to fetch the new user to take the id to the JWTplayload 
        if(!payLoadInfo){
            
            res.status(500).json({message: "error in registry, refetching the saved user"})
            return
        }
        const payload: JwtPayload = { // creating the payload
            username: payLoadInfo.username,
            userId: payLoadInfo._id,
            isAdmin: admin,
            message: "I dont know what should be stored here, so I wrote this" // not necessary, just funi
        }
        const token: string = jwt.sign(payload, process.env.SECRET as string, { expiresIn: "100m"}) // creation of the token

        res.status(200).json({messsage: "registery successful", token: token})
    } catch (error: any) {
        console.log(`Error in registery: ${error}`)
        res.status(500).json({message: "Internal server error"})
    }
    return
    })

router.post('/api/login', async (req: Request, res: Response): Promise<void> => {  // login

    try {
        const listOfUsers: IUser[] = await User.find()

        for (let index = 0; index < listOfUsers.length; index++) { // checking if that user exist and has the password equal the saved one.
            if (req.body.name == listOfUsers[index].username && bcrypt.compareSync(req.body.password, listOfUsers[index].password)){
                const payload: JwtPayload = { // creating token payload
                    username: listOfUsers[index].username,
                    userId: listOfUsers[index]._id,
                    isAdmin: listOfUsers[index].admin,
                    message: "I dont know what should be stored here, so I wrote this"
                }
                const token: string = jwt.sign(payload, process.env.SECRET as string, { expiresIn: "100m"})
                res.status(200).json({message: "Login succsesful", token: token})
                return //apparently crusial for preventing http_headers error
            };
        }

        res.status(403).json({message: `login failed `})
    } catch (error: any) {
        console.log(`Error while login: ${error}`)
        res.status(500).json({message: "Internal server error"})
    }
    return
});

router.put('/api/moveCard', validateToken, async (req: Request, res: Response): Promise<void> => { // move a card if authenticated

    try {

        let dropCard: ICard | null | undefined = await Card.findById(req.body.dropCardId)
        if(dropCard == undefined || dropCard == null){
            res.status(404).json({message: "Drop card Element not found"})
            return; // card needs to exist
        } 
        const originalIndex: number = dropCard.index
        const endIndex: number = req.body.placeIndex // saving values for easier access.

        if(req.body.column == dropCard.column) { // if the movable card stays in the same column
            let cards: ICard[] | null | undefined = await Card.find({column: req.body.column})
            if(!cards){
                res.status(404).json({message: "Cards not found"})
                return; // card needs to exist
            } 
            let direction: number = originalIndex < endIndex ? -1 : 1 // the direction the card moves up/down

            if(direction == 1){
                for (let index = 0; index < cards.length; index++) { //these move cards' index values to right direction so the cards in the list have corrent indexes
                    if(cards[index].index < originalIndex && cards[index].index >= endIndex){
                        cards[index].index += direction
                        cards[index].save()
                    }
                }
            } else { //these move cards' index values to right direction so the cards in the list have corrent indexes
                for (let index = 0; index < cards.length; index++) {
                    if(cards[index].index > originalIndex && cards[index].index <= endIndex){
                        cards[index].index += direction
                        cards[index].save()
                    }
                }
            }
            

            dropCard.index = endIndex // moving the card to its place, done last, so it would affect the lists
            await dropCard.save() 
            res.status(200).json({
                message: "movement successful"
            })
            return
        } else { // if the movable card changes column 
            let placeCards: ICard[] | null | undefined = await Card.find({column: req.body.column})
            if(!placeCards){
                res.status(404).json({message: "Cards not found"})
                return; // card needs to exist
            }

            let dropCards: ICard[] | null | undefined = await Card.find({column: dropCard?.column})
            if(!dropCards){
                res.status(404).json({message: "Cards not found"})
                return; // card needs to exist
            }

            for (let index = 0; index < placeCards.length; index++) { //these move cards' index values to right direction so the cards in the list have correct indexes
                if(placeCards[index].index >= endIndex){
                    placeCards[index].index += 1
                    placeCards[index].save()
                }
            }

            for (let index = 0; index < dropCards.length; index++) { //these move cards' index values to right direction so the cards in the list have correct indexes
                if(dropCards[index].index > originalIndex){
                    dropCards[index].index -= 1
                    dropCards[index].save()
                }
            }
            
            dropCard.index = endIndex
            dropCard.column = req.body.column // moving the card to its place and changing its column, done last, so it would affect the lists
            await dropCard.save() 
            res.status(200).json({
                message: "movement successful"
            })
            return
        }

        res.status(404).json({message: "should be here"}) 
        
    } catch (error: any) {
        console.log(`Error in editing a card: ${error}`)
        res.status(500).json({message: "Internal server error"})
    }
    return
})

router.put('/api/card', validateToken, async (req: Request, res: Response): Promise<void> => { // edit a card if authenticated

    try {
        let dateTime = new Date() //https://www.scaler.com/topics/typescript/typescript-date/

        
        let card: ICard | null | undefined = await Card.findById(req.body.cardId)
        if(card == undefined || card == null){
            res.status(404).json({message: "Element not found"})
            return; // card needs to exist
        } 
        // these (x ? y : x) prevent changing card text to empty
        card.name = req.body.name ? req.body.name : card.name // if client sends info, update it, otherwise info remains the same
        card.text = req.body.text ? req.body.text : card.text
        card.status = req.body.status ? req.body.status : card.status
        card.timeToComplete = req.body.timeToComplete ? req.body.timeToComplete : card.timeToComplete
        card.timeSpend = req.body.timeSpend ? req.body.timeSpend : card.timeSpend
        card.createTime = (dateTime as unknown) as MDate // probably breaks some code laws, but it works.
        card.column = req.body.column ? req.body.column : card.column
        //card.index = req.body.index ? req.body.index : card.index     easily breaks the index system if included
        card.colour = req.body.colour ? req.body.colour : card.colour

        await card.save()
        res.status(200).json({
            name: req.body.name,
            text:  req.body.text,
            status: req.body.status,
            timeToComplete: req.body.timeToComplete,
            timeSpend: req.body.timeSpend,
            createTime: dateTime,
            column: req.body.column,
            index: req.body.index,
            colour: req.body.colour
        })
    } catch (error: any) {
        console.log(`Error in editing a card: ${error}`)
        res.status(500).json({message: "Internal server error"})
    }
    return
})

router.put('/api/comment', validateToken, async (req: Request, res: Response): Promise<void> => { // edit a comment if authenticated
    
    try {

        let comment: IComment | null | undefined = await Comment.findById(req.body.commentId)
        
        if(comment == undefined || comment == null){
            res.status(404).json({message: "Element not found"})
            return; // card needs to exist
        } 

        let dateTime = new Date()
        // these (x ? y : x) prevent changing comment data to empty
        comment.post = req.body.post ? req.body.post : comment.post
        comment.text = req.body.text ? req.body.text : comment.text
        comment.createdAt = (dateTime as unknown) as MDate // 

        await comment.save()
        res.status(200).json({
            post: req.body.post,
            text: req.body.text,
            createdAt: dateTime
        })
    } catch (error: any) {
        console.log(`Error in editing a comment: ${error}`)
        res.status(500).json({message: "Internal server error"})
    }
    return
})

router.put('/api/column', validateToken, async (req: Request, res: Response): Promise<void> => { // edit a column if authenticated
    
    try {
        let column: IColumn | null | undefined = await Column.findById(req.body.columnId)
        
        if(column == undefined || column == null){
            res.status(404).json({message: "Element not found"})
            return; // card needs to exist
        } 
        // these (x ? y : x) prevent changing column name to empty
        column.name = req.body.name ? req.body.name : column.name

        await column.save()
        res.status(200).json({
            name: req.body.name
        })
    } catch (error: any) {
        console.log(`Error in editing a column: ${error}`)
        res.status(500).json({message: "Internal server error"})
    }
    return
})

router.delete('/api/deleteCard', validateToken, async (req: Request, res: Response): Promise<void> => {  // delete a specific card 

    try {
        let card: ICard | null | undefined = await Card.findById(req.body.id) // just to check if card exists
        if(card == undefined || card == null){
            res.status(404).json({message: "Element not found"})
            return
        } 
        let cards: ICard[] | null | undefined = await Card.find({column: card.column})
        if(!cards){ // could have used this syntax elsewhere and save some time
            res.status(500).json({message: "Internal server error, no cards where found"})
            return
        }
        if(card.index >= 0){ //allows deleting broken cards, should affect outside testing but here in case something doesn't work as intended 
            for (let index = card.index; index < cards.length; index++) {
                const element = cards[index];
                element.index -= 1
                await element.save()
            }
        }
        

        await Card.deleteOne({_id: req.body.id}) // deleting card and comments attached to that card
        await Comment.deleteMany({post: req.body.id})
        res.status(200).json({message: "deletion was successful"})
    } catch (error: any) {
        console.log(`Error while deleting a card: ${error}`)
        res.status(500).json({message: "Internal server error"})
    }
    return
    })

router.delete('/api/deleteColumn', validateToken, async (req: Request, res: Response): Promise<void> => {  // delete a specific card 

    try {
        let column: IColumn | null | undefined = await Column.findById(req.body.id) // just to check if column exists
        if(column == undefined || column == null){
            res.status(404).json({message: "Element not found"})
            return
        } 
        
        let cards: ICard[] | null | undefined = await Card.find({column: column._id})

        if(cards !== undefined && cards !== null){ // in case of failed query, only column is deleted
            for (let index = 0; index < cards.length; index++) {  // when deleting a column, this goes all cards of that column and deletes the comments from those cards.
                await Comment.deleteMany({post: cards[index]._id})
            }
            await Card.deleteMany({column: column._id})
        }
        
        await Column.deleteOne({_id: req.body.id})
        res.status(200).json({message: "deletion was successful"})
    } catch (error: any) {
        console.log(`Error while deleting a column: ${error}`)
        res.status(500).json({message: "Internal server error"})
    }
    return
    })

router.delete('/api/deleteUser', validateTokenAdmin, async (req: Request, res: Response): Promise<void> => {  // delete a user card, only admin 

    try {
        let user: IUser | null | undefined = await User.findById(req.body.id) // just to check if user exists
        if(user == undefined || user == null){
            res.status(404).json({message: "Element not found"})
            return
        } 
        
        let columns: IColumn[] | null | undefined = await Column.find({userId: req.body.id}) //goes through and deletes all connected to user. Since comments are only connected to cards (in case the feature where users may use same board) and cards are connect to only column (no actual reason here why userID isn't saved), and columns to users, these loops are necessary to delete all. 
        if(columns !== undefined && columns !== null){ //These loops wouldn't been here if user id was originally attached to everything
            for (let counter = 0; counter < columns.length; counter++) {
                let cards: ICard[] | null | undefined = await Card.find({column: columns[counter]._id})

                if(cards !== undefined && cards !== null){ // in case of failed query, only column is deleted
                    for (let index = 0; index < cards.length; index++) {  // when deleting a column, this goes all cards of that column and deletes the comments from those cards.
                        await Comment.deleteMany({post: cards[index]._id})
                    }
                    await Card.deleteMany({column: columns[counter]._id})
                }
            }
        }
        await Column.deleteMany({userId: req.body.id}) //deletes all columns before user.
        await User.deleteOne({_id: req.body.id})

        res.status(200).json({message: "deletion was successful"})
    } catch (error: any) {
        console.log(`Error while deleting a column: ${error}`)
        res.status(500).json({message: "Internal server error"})
    }
    return
    })

router.delete('/api/deleteComment', validateToken, async (req: Request, res: Response): Promise<void> => {  // delete a specific comment 

    try {
        let comment: IComment | null | undefined = await Comment.findById(req.body.id) // just to check if comment exists
        if(comment == undefined || comment == null){
            res.status(404).json({message: "Element not found"})
            return
        } 

        await Comment.deleteOne({_id: req.body.id}) // then deletes it
        res.status(200).json({message: "deletion was successful"})
    } catch (error: any) {
        console.log(`Error while deleting a card: ${error}`)
        res.status(500).json({message: "Internal server error"})
    }
    return
    })

setup()

export default router