import mongoose, {Document, Schema} from "mongoose";

interface ITodo extends Document{
    todo: string
    checked: boolean
}

interface IUser extends Document{
    name: string,
    todos: ITodo[]
}

let todoSchema: Schema = new Schema ({
    todo: {type: String, require: true},
    checked: {type: Boolean, default: false, require: false }
})

let userSchema: Schema = new Schema ({
    name: {type: String, require: true},
    todos: [todoSchema]
})

const User: mongoose.Model<IUser> = mongoose.model<IUser>("User", userSchema)
const Todo: mongoose.Model<ITodo> = mongoose.model<ITodo>("Todo", todoSchema)

export {User, IUser, Todo, ITodo}