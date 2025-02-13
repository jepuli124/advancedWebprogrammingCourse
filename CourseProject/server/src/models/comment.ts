import mongoose, {Date, Document, Schema} from "mongoose";

interface IComment extends Document{
    text: string
    post: string
    createdAt: Date
    posterName: string
}

let comments: Schema = new Schema ({
    text: {type: String, require: true},
    post: {type: String, require: true},
    posterName: {type: String, require: true},
    createdAt: {type: Date, require: true}
})

const Comment: mongoose.Model<IComment> = mongoose.model<IComment>("comments", comments)

export {IComment, Comment}