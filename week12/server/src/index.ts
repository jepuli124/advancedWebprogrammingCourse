import {Request, Response, Router} from "express"
// import { body, Result, ValidationError, validationResult } from 'express-validator'
import path from "path";
// import bcrypt from 'bcrypt';
// import jwt, { JwtPayload } from 'jsonwebtoken';
// import { validateToken, validateTokenAdmin } from '../middleware/validate-config'
import {IBook, Book} from './models/Book'


const router: Router = Router()

function setup(){
    
    }

router.post('/api/book', async (req: any, res: any) => {
    
    try {
        console.log(req.body)
        let newBook = new Book ({
            name: req.body.name,
            author: req.body.author,
            pages: req.body.pages
        })
        await newBook.save()
        res.status(200).json({
            name: req.body.name,
            author: req.body.author,
            pages: req.body.pages
        })
    } catch (error: any) {
        console.log(`Error in registery: ${error}`)
        return res.status(500).json({message: "Internal server error"})
    }
})

router.get('/api/book/:book', async (req: any, res: any) => { 
    console.log("searchin for a book")
    try {
        let book: IBook | null | undefined = await Book.findOne({name: req.params['book']})
        if(book == undefined || book == null){
            return res.status(404).json({message: "Element not found"})
        } 
        console.log("book found", book)
        return res.status(200).json(book)
    } catch (error: any) {
        console.log(`Error while get a book: ${error}`)
        return res.status(500).json({message: "Internal server error"})
    }
    });

setup()

export default router