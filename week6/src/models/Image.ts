import mongoose, {Document, Schema} from "mongoose";

interface IImage extends Document{
    filename: string
    path: string
    id?: String
}

let images: Schema = new Schema ({
    filename: {type: String, require: true},
    path: {type: String, require: true},
})

const Image: mongoose.Model<IImage> = mongoose.model<IImage>("images", images)
//const Todo: mongoose.Model<ITodo> = mongoose.model<ITodo>("Todo", todoSchema)

export {IImage, Image}