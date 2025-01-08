import mongoose, {Document, Schema} from "mongoose";

interface IUser extends Document{
    email: string
    password: string
    username: string
    isAdmin: boolean
}

let users: Schema = new Schema ({
    email: {type: String, require: true},
    password: {type: String, require: true},
    username: {type: String, require: true},
    isAdmin: {type: Boolean, require: true}
})

const User: mongoose.Model<IUser> = mongoose.model<IUser>("users", users)
//const Todo: mongoose.Model<ITodo> = mongoose.model<ITodo>("Todo", todoSchema)

export {IUser, User}
// {User, IUser, Todo, ITodo}