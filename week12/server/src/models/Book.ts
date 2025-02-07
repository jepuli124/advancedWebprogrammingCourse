import mongoose, {Date, Document, Schema} from "mongoose";

interface IBook extends Document{
    name: string
    author: string
    pages: number
}

let books: Schema = new Schema ({
    name: {type: String, require: true},
    author: {type: String, require: true},
    pages: {type: Number, require: true}
})

const Book: mongoose.Model<IBook> = mongoose.model<IBook>("books", books)

export {IBook, Book}