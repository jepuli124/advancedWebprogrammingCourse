"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import bcrypt from 'bcrypt';
// import jwt, { JwtPayload } from 'jsonwebtoken';
// import { validateToken, validateTokenAdmin } from '../middleware/validate-config'
const Book_1 = require("./models/Book");
const router = (0, express_1.Router)();
function setup() {
}
router.post('/api/book', async (req, res) => {
    try {
        console.log(req.body);
        let newBook = new Book_1.Book({
            name: req.body.name,
            author: req.body.author,
            pages: req.body.pages
        });
        await newBook.save();
        res.status(200).json({
            name: req.body.name,
            author: req.body.author,
            pages: req.body.pages
        });
    }
    catch (error) {
        console.log(`Error in registery: ${error}`);
        return res.status(500).json({ message: "Internal server error" });
    }
});
router.get('/api/book/:book', async (req, res) => {
    console.log("searchin for a book");
    try {
        let book = await Book_1.Book.findOne({ name: req.params['book'] });
        if (book == undefined || book == null) {
            return res.status(404).json({ message: "Element not found" });
        }
        console.log("book found", book);
        return res.status(200).json(book);
    }
    catch (error) {
        console.log(`Error while get a book: ${error}`);
        return res.status(500).json({ message: "Internal server error" });
    }
});
setup();
exports.default = router;
