import mongoose, {Document, Schema} from "mongoose";

interface IOffer extends Document{
    title: string
    description: string
    price: number
    imageId: String
}

let offers: Schema = new Schema ({
    title: {type: String, require: true},
    description: {type: String, require: true},
    price: {type: Number, require: true},
    imageId: {type: String, require: false}
})

const Offer: mongoose.Model<IOffer> = mongoose.model<IOffer>("offers", offers)
//const Todo: mongoose.Model<ITodo> = mongoose.model<ITodo>("Todo", todoSchema)

export {IOffer, Offer}
// {User, IUser, Todo, ITodo}