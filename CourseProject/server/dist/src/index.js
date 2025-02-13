"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validate_config_1 = require("../middleware/validate-config");
const Card_1 = require("./models/Card");
const User_1 = require("./models/User");
const comment_1 = require("./models/comment");
const Column_1 = require("./models/Column");
const router = (0, express_1.Router)();
function setup() {
}
//These routes cause error if req and res are both in correct type like in source code, which can be removed by givin a promise with void.
// I dont know what that means but it follows <the "If TypeScript is not used or it is used badly (like continuous use of any type)" rule. 
router.post('/api/card', validate_config_1.validateToken, async (req, res) => {
    try {
        let dateTime = new Date(); //https://www.scaler.com/topics/typescript/typescript-date/
        const token = req.header('authorization')?.split(" ")[1]; // getting the userid out of the payload,
        if (!token) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }
        const arrayToken = token.split('.'); //https://medium.com/@feldjesus/how-to-decode-a-jwt-token-175305335024 
        const tokenPayload = JSON.parse(atob(arrayToken[1]));
        let column = await Column_1.Column.findOne({ name: req.body.column, userId: tokenPayload.userId }); // find a column and check if it exist
        if (column == undefined || column == null) {
            res.status(404).json({ message: "Column not found" });
            return; // column is needed
        }
        let cards = await Card_1.Card.find({ column: column._id }); // fetched for the index value which is used to sort these cards
        let newBook = new Card_1.Card({
            name: req.body.name,
            text: req.body.text,
            status: req.body.status,
            timeToComplete: req.body.timeToComplete,
            timeSpend: req.body.timeSpend,
            createTime: dateTime,
            column: column._id,
            index: cards.length,
            colour: req.body.colour
        });
        await newBook.save();
        res.status(200).json({
            name: req.body.name,
            text: req.body.text,
            status: req.body.status,
            timeToComplete: req.body.timeToComplete,
            timeSpend: req.body.timeSpend,
            createTime: dateTime,
            column: column._id,
            index: cards.length,
            colour: req.body.colour
        });
    }
    catch (error) { // standard error catching
        console.log(`Error in entering a card: ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
    return;
});
router.post('/api/comment', validate_config_1.validateToken, async (req, res) => {
    try {
        const token = req.header('authorization')?.split(" ")[1]; // getting the username out of the comment,
        if (!token) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }
        const arrayToken = token.split('.'); //https://medium.com/@feldjesus/how-to-decode-a-jwt-token-175305335024 
        const tokenPayload = JSON.parse(atob(arrayToken[1]));
        let dateTime = new Date(); // creation time
        let newComment = new comment_1.Comment({
            post: req.body.post,
            text: req.body.text,
            createdAt: dateTime,
            posterName: tokenPayload.username
        });
        await newComment.save();
        res.status(200).json({
            post: req.body.post,
            text: req.body.text,
            createdAt: dateTime,
            posterName: tokenPayload.username
        });
    }
    catch (error) { // standard error catching
        console.log(`Error in entering a comment: ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
    return;
});
router.post('/api/column', validate_config_1.validateToken, async (req, res) => {
    try {
        if (!req.body.name) { // column has to have name
            res.status(401).json({ message: "Invalid column name" });
            return;
        }
        const token = req.header('authorization')?.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }
        const arrayToken = token.split('.'); //https://medium.com/@feldjesus/how-to-decode-a-jwt-token-175305335024 
        const tokenPayload = JSON.parse(atob(arrayToken[1])); // getting userId out of the session token token
        let newComment = new Column_1.Column({
            name: req.body.name,
            userId: tokenPayload.userId
        });
        await newComment.save();
        res.status(200).json({
            name: req.body.name,
            userId: tokenPayload.userId
        });
    }
    catch (error) {
        console.log(`Error in entering a column: ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
    return;
});
router.get('/api/cards', validate_config_1.validateTokenAdmin, async (req, res) => {
    try {
        let cards = await Card_1.Card.find();
        if (cards == undefined || cards == null) {
            res.status(404).json({ message: "Cards not found" });
            return; // prevents errors ; might be unnecessary
        }
        res.status(200).json(cards);
    }
    catch (error) {
        console.log(`Error while get all cards: ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
    return;
});
router.get('/api/columns', validate_config_1.validateTokenAdmin, async (req, res) => {
    try {
        let columns = await Column_1.Column.find();
        if (columns == undefined || columns == null) {
            res.status(404).json({ message: "Columns not found" });
            return; // very necessary
        }
        res.status(200).json(columns);
    }
    catch (error) {
        console.log(`Error while get all columns: ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
    return;
});
router.get('/api/comments', validate_config_1.validateTokenAdmin, async (req, res) => {
    try {
        let comments = await comment_1.Comment.find();
        if (comments == undefined || comments == null) {
            res.status(404).json({ message: "Comments not found" });
            return; // very not good
        }
        res.status(200).json(comments);
    }
    catch (error) {
        console.log(`Error while get all comments: ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
    return;
});
router.get('/api/users', validate_config_1.validateTokenAdmin, async (req, res) => {
    try {
        let users = await User_1.User.find();
        if (users == undefined || users == null) {
            res.status(404).json({ message: "Users not found" });
            return;
        }
        res.status(200).json(users);
    }
    catch (error) {
        console.log(`Error while get all users: ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
    return;
});
router.get('/api/columnByUser', validate_config_1.validateToken, async (req, res) => {
    try {
        const token = req.header('authorization')?.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }
        const arrayToken = token.split('.'); //https://medium.com/@feldjesus/how-to-decode-a-jwt-token-175305335024 
        const tokenPayload = JSON.parse(atob(arrayToken[1])); // reading the userId out of the session token.
        let columns = await Column_1.Column.find({ userId: tokenPayload.userId });
        if (columns == undefined || columns == null) {
            res.status(404).json({ message: "Columns not found" });
            return; // very necessary
        }
        res.status(200).json(columns);
    }
    catch (error) {
        console.log(`Error while get all columns: ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
    return;
});
router.post('/api/cardsByColum', validate_config_1.validateToken, async (req, res) => {
    try {
        let cards = await Card_1.Card.find({ column: req.body.columnId });
        if (cards == undefined || cards == null) {
            res.status(404).json({ message: "Element not found" });
            return;
        }
        res.status(200).json(cards);
    }
    catch (error) {
        console.log(`Error while get all cards: ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
    return;
});
router.post('/api/commentsByCard', validate_config_1.validateToken, async (req, res) => {
    try {
        let comments = await comment_1.Comment.find({ post: req.body.commentRelatedId });
        if (comments == undefined || comments == null) {
            res.status(404).json({ message: "Element not found" });
            return;
        }
        res.status(200).json(comments);
    }
    catch (error) {
        console.log(`Error while get all cards: ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
    return;
});
router.get('/api/card/:card', validate_config_1.validateToken, async (req, res) => {
    try {
        let card = await Card_1.Card.findOne({ name: req.params['card'] });
        if (card == undefined || card == null) {
            res.status(404).json({ message: "Element not found" });
            return;
        }
        console.log("card found", card);
        res.status(200).json(card);
    }
    catch (error) {
        console.log(`Error while get a card: ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
    return;
});
router.post('/api/validateToken', validate_config_1.validateToken, async (req, res) => {
    try {
        res.status(200).json({ message: "proceed" });
    }
    catch (error) {
        console.log(`Error while get a card: ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
    return;
});
router.get('/api/validateTokenAdmin', validate_config_1.validateTokenAdmin, async (req, res) => {
    try {
        res.status(200).json({ message: "proceed" });
    }
    catch (error) {
        console.log(`Error while get a card: ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
    return;
});
router.post('/api/register', async (req, res) => {
    try {
        const listOfUsers = await User_1.User.find();
        for (let index = 0; index < listOfUsers.length; index++) { // checking that username is unique, not necessary but I thought it was a nice feature 
            if (req.body.name == listOfUsers[index].username) {
                console.log("Username already registered", req.body.name, listOfUsers[index].username);
                res.status(403).json({ msg: "Username already registered" });
                return;
            }
            ;
        }
        const salt = bcrypt_1.default.genSaltSync(10, 'b'); // password encryption process, taken from course's source codes. 
        let password = bcrypt_1.default.hashSync(req.body.password, salt);
        let admin = false;
        if (req.body.isAdmin) { //req.body.isAdmin is either "on" or null, so this changes it to boolean
            admin = true;
        }
        const newUser = new User_1.User({
            username: req.body.name,
            password: password,
            admin: admin
        });
        await newUser.save();
        const payLoadInfo = await User_1.User.findOne({ username: req.body.name }); //need to fetch the new user to take the id to the JWTplayload 
        if (!payLoadInfo) {
            res.status(500).json({ message: "error in registry, refetching the saved user" });
            return;
        }
        const payload = {
            username: payLoadInfo.username,
            userId: payLoadInfo._id,
            isAdmin: admin,
            message: "I dont know what should be stored here, so I wrote this" // not necessary, just funi
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.SECRET, { expiresIn: "100m" }); // creation of the token
        res.status(200).json({ messsage: "registery successful", token: token });
    }
    catch (error) {
        console.log(`Error in registery: ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
    return;
});
router.post('/api/login', async (req, res) => {
    try {
        const listOfUsers = await User_1.User.find();
        for (let index = 0; index < listOfUsers.length; index++) { // checking if that user exist and has the password equal the saved one.
            if (req.body.name == listOfUsers[index].username && bcrypt_1.default.compareSync(req.body.password, listOfUsers[index].password)) {
                const payload = {
                    username: listOfUsers[index].username,
                    userId: listOfUsers[index]._id,
                    isAdmin: listOfUsers[index].admin,
                    message: "I dont know what should be stored here, so I wrote this"
                };
                const token = jsonwebtoken_1.default.sign(payload, process.env.SECRET, { expiresIn: "100m" });
                res.status(200).json({ message: "Login succsesful", token: token });
                return; //apparently crusial for preventing http_headers error
            }
            ;
        }
        res.status(403).json({ message: `login failed ` });
    }
    catch (error) {
        console.log(`Error while login: ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
    return;
});
router.put('/api/moveCard', validate_config_1.validateToken, async (req, res) => {
    try {
        let dropCard = await Card_1.Card.findById(req.body.dropCardId);
        if (dropCard == undefined || dropCard == null) {
            res.status(404).json({ message: "Drop card Element not found" });
            return; // card needs to exist
        }
        const originalIndex = dropCard.index;
        const endIndex = req.body.placeIndex; // saving values for easier access.
        if (req.body.column == dropCard.column) { // if the movable card stays in the same column
            let cards = await Card_1.Card.find({ column: req.body.column });
            if (!cards) {
                res.status(404).json({ message: "Cards not found" });
                return; // card needs to exist
            }
            let direction = originalIndex < endIndex ? -1 : 1; // the direction the card moves up/down
            if (direction == 1) {
                for (let index = 0; index < cards.length; index++) { //these move cards' index values to right direction so the cards in the list have corrent indexes
                    if (cards[index].index < originalIndex && cards[index].index >= endIndex) {
                        cards[index].index += direction;
                        cards[index].save();
                    }
                }
            }
            else { //these move cards' index values to right direction so the cards in the list have corrent indexes
                for (let index = 0; index < cards.length; index++) {
                    if (cards[index].index > originalIndex && cards[index].index <= endIndex) {
                        cards[index].index += direction;
                        cards[index].save();
                    }
                }
            }
            dropCard.index = endIndex; // moving the card to its place, done last, so it would affect the lists
            await dropCard.save();
            res.status(200).json({
                message: "movement successful"
            });
            return;
        }
        else { // if the movable card changes column 
            let placeCards = await Card_1.Card.find({ column: req.body.column });
            if (!placeCards) {
                res.status(404).json({ message: "Cards not found" });
                return; // card needs to exist
            }
            let dropCards = await Card_1.Card.find({ column: dropCard?.column });
            if (!dropCards) {
                res.status(404).json({ message: "Cards not found" });
                return; // card needs to exist
            }
            for (let index = 0; index < placeCards.length; index++) { //these move cards' index values to right direction so the cards in the list have correct indexes
                if (placeCards[index].index >= endIndex) {
                    placeCards[index].index += 1;
                    placeCards[index].save();
                }
            }
            for (let index = 0; index < dropCards.length; index++) { //these move cards' index values to right direction so the cards in the list have correct indexes
                if (dropCards[index].index > originalIndex) {
                    dropCards[index].index -= 1;
                    dropCards[index].save();
                }
            }
            dropCard.index = endIndex;
            dropCard.column = req.body.column; // moving the card to its place and changing its column, done last, so it would affect the lists
            await dropCard.save();
            res.status(200).json({
                message: "movement successful"
            });
            return;
        }
        res.status(404).json({ message: "should be here" });
    }
    catch (error) {
        console.log(`Error in editing a card: ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
    return;
});
router.put('/api/card', validate_config_1.validateToken, async (req, res) => {
    try {
        let dateTime = new Date(); //https://www.scaler.com/topics/typescript/typescript-date/
        let card = await Card_1.Card.findById(req.body.cardId);
        if (card == undefined || card == null) {
            res.status(404).json({ message: "Element not found" });
            return; // card needs to exist
        }
        // these (x ? y : x) prevent changing card text to empty
        card.name = req.body.name ? req.body.name : card.name; // if client sends info, update it, otherwise info remains the same
        card.text = req.body.text ? req.body.text : card.text;
        card.status = req.body.status ? req.body.status : card.status;
        card.timeToComplete = req.body.timeToComplete ? req.body.timeToComplete : card.timeToComplete;
        card.timeSpend = req.body.timeSpend ? req.body.timeSpend : card.timeSpend;
        card.createTime = dateTime; // probably breaks some code laws, but it works.
        card.column = req.body.column ? req.body.column : card.column;
        //card.index = req.body.index ? req.body.index : card.index     easily breaks the index system if included
        card.colour = req.body.colour ? req.body.colour : card.colour;
        await card.save();
        res.status(200).json({
            name: req.body.name,
            text: req.body.text,
            status: req.body.status,
            timeToComplete: req.body.timeToComplete,
            timeSpend: req.body.timeSpend,
            createTime: dateTime,
            column: req.body.column,
            index: req.body.index,
            colour: req.body.colour
        });
    }
    catch (error) {
        console.log(`Error in editing a card: ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
    return;
});
router.put('/api/comment', validate_config_1.validateToken, async (req, res) => {
    try {
        let comment = await comment_1.Comment.findById(req.body.commentId);
        if (comment == undefined || comment == null) {
            res.status(404).json({ message: "Element not found" });
            return; // card needs to exist
        }
        let dateTime = new Date();
        // these (x ? y : x) prevent changing comment data to empty
        comment.post = req.body.post ? req.body.post : comment.post;
        comment.text = req.body.text ? req.body.text : comment.text;
        comment.createdAt = dateTime; // 
        await comment.save();
        res.status(200).json({
            post: req.body.post,
            text: req.body.text,
            createdAt: dateTime
        });
    }
    catch (error) {
        console.log(`Error in editing a comment: ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
    return;
});
router.put('/api/column', validate_config_1.validateToken, async (req, res) => {
    try {
        let column = await Column_1.Column.findById(req.body.columnId);
        if (column == undefined || column == null) {
            res.status(404).json({ message: "Element not found" });
            return; // card needs to exist
        }
        // these (x ? y : x) prevent changing column name to empty
        column.name = req.body.name ? req.body.name : column.name;
        await column.save();
        res.status(200).json({
            name: req.body.name
        });
    }
    catch (error) {
        console.log(`Error in editing a column: ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
    return;
});
router.delete('/api/deleteCard', validate_config_1.validateToken, async (req, res) => {
    try {
        let card = await Card_1.Card.findById(req.body.id); // just to check if card exists
        if (card == undefined || card == null) {
            res.status(404).json({ message: "Element not found" });
            return;
        }
        let cards = await Card_1.Card.find({ column: card.column });
        if (!cards) { // could have used this syntax elsewhere and save some time
            res.status(500).json({ message: "Internal server error, no cards where found" });
            return;
        }
        if (card.index >= 0) { //allows deleting broken cards, should affect outside testing but here in case something doesn't work as intended 
            for (let index = card.index; index < cards.length; index++) {
                const element = cards[index];
                element.index -= 1;
                await element.save();
            }
        }
        await Card_1.Card.deleteOne({ _id: req.body.id }); // deleting card and comments attached to that card
        await comment_1.Comment.deleteMany({ post: req.body.id });
        res.status(200).json({ message: "deletion was successful" });
    }
    catch (error) {
        console.log(`Error while deleting a card: ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
    return;
});
router.delete('/api/deleteColumn', validate_config_1.validateToken, async (req, res) => {
    try {
        let column = await Column_1.Column.findById(req.body.id); // just to check if column exists
        if (column == undefined || column == null) {
            res.status(404).json({ message: "Element not found" });
            return;
        }
        let cards = await Card_1.Card.find({ column: column._id });
        if (cards !== undefined && cards !== null) { // in case of failed query, only column is deleted
            for (let index = 0; index < cards.length; index++) { // when deleting a column, this goes all cards of that column and deletes the comments from those cards.
                await comment_1.Comment.deleteMany({ post: cards[index]._id });
            }
            await Card_1.Card.deleteMany({ column: column._id });
        }
        await Column_1.Column.deleteOne({ _id: req.body.id });
        res.status(200).json({ message: "deletion was successful" });
    }
    catch (error) {
        console.log(`Error while deleting a column: ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
    return;
});
router.delete('/api/deleteUser', validate_config_1.validateTokenAdmin, async (req, res) => {
    try {
        let user = await User_1.User.findById(req.body.id); // just to check if user exists
        if (user == undefined || user == null) {
            res.status(404).json({ message: "Element not found" });
            return;
        }
        let columns = await Column_1.Column.find({ userId: req.body.id }); //goes through and deletes all connected to user. Since comments are only connected to cards (in case the feature where users may use same board) and cards are connect to only column (no actual reason here why userID isn't saved), and columns to users, these loops are necessary to delete all. 
        if (columns !== undefined && columns !== null) { //These loops wouldn't been here if user id was originally attached to everything
            for (let counter = 0; counter < columns.length; counter++) {
                let cards = await Card_1.Card.find({ column: columns[counter]._id });
                if (cards !== undefined && cards !== null) { // in case of failed query, only column is deleted
                    for (let index = 0; index < cards.length; index++) { // when deleting a column, this goes all cards of that column and deletes the comments from those cards.
                        await comment_1.Comment.deleteMany({ post: cards[index]._id });
                    }
                    await Card_1.Card.deleteMany({ column: columns[counter]._id });
                }
            }
        }
        await Column_1.Column.deleteMany({ userId: req.body.id }); //deletes all columns before user.
        await User_1.User.deleteOne({ _id: req.body.id });
        res.status(200).json({ message: "deletion was successful" });
    }
    catch (error) {
        console.log(`Error while deleting a column: ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
    return;
});
router.delete('/api/deleteComment', validate_config_1.validateToken, async (req, res) => {
    try {
        let comment = await comment_1.Comment.findById(req.body.id); // just to check if comment exists
        if (comment == undefined || comment == null) {
            res.status(404).json({ message: "Element not found" });
            return;
        }
        await comment_1.Comment.deleteOne({ _id: req.body.id }); // then deletes it
        res.status(200).json({ message: "deletion was successful" });
    }
    catch (error) {
        console.log(`Error while deleting a card: ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
    return;
});
setup();
exports.default = router;
