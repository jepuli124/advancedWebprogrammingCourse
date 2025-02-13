import mongoose, {Date, Document, Schema} from "mongoose";

interface IColumn extends Document{
    name: string,
    userId: string

}

let columns: Schema = new Schema ({
    name: {type: String, require: true},
    userId: {type: String, require: true}
})

const Column: mongoose.Model<IColumn> = mongoose.model<IColumn>("columns", columns)

export {IColumn, Column}