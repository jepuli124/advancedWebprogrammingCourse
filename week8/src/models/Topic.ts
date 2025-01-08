import mongoose, {Date, Document, Schema} from "mongoose";

interface ITopic extends Document{
    title: string
    content: string
    username: string
    createdAt: Date
}

let topics: Schema = new Schema ({
    title: {type: String, require: true},
    content: {type: String, require: true},
    username: {type: String, require: true},
    createdAt: {type: Date, require: true}
})

const Topic: mongoose.Model<ITopic> = mongoose.model<ITopic>("topics", topics)

export {ITopic, Topic}