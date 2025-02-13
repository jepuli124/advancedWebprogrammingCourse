interface IUser extends Document{ // in seperate file for easy usage and modifications
    username: string
    password: string
    _id: string
}

export default IUser