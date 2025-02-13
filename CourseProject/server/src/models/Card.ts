import mongoose, {Date, Document, Schema} from "mongoose";

interface ICard extends Document{
    name: string
    text: string
    status: string
    timeToComplete: number
    timeSpend: number
    createTime: Date
    column: string
    index: number
    colour: string
}

let cards: Schema = new Schema ({
    name: {type: String, require: true},
    text: {type: String, require: true},
    status: {type: String, require: true},
    timeToComplete: {type: Number, require: true},
    timeSpend: {type: Number, require: true},
    createTime: {type: Date, require: true},
    column: {type: String, require: true},
    index: {type: Number, require: true},
    colour: {type: String, require: true}
})

const Card: mongoose.Model<ICard> = mongoose.model<ICard>("cards", cards)

export {ICard, Card}