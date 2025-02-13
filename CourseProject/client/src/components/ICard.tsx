// in seperate file for easy usage and modifications

interface ICard extends Document{
    name: string
    text: string
    status: string
    comments: string[]
    timeToComplete: number
    timeSpend: number
    createTime: Date
    column: string
    _id: string
    colour: string
    index: number
}

export default ICard