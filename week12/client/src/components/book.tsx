
import { useState} from 'react'
import { useParams } from "react-router"
//import CardContent from '@mui/material/CardContent';

interface IData {
    name: string,
    author: string,
    pages: number
}

const Book: React.FC = () => {
    
    const [data, setData] = useState<IData | null>(null)


    const params = useParams()
    
    const fetchBook = async (BookName: string) => {
        const url:string = '/api/book/' + BookName
        
        const incomingData = await fetch(url)
        
        if(!incomingData.ok){
            console.log("data fetch failed")
            return null
        }


        
        const preparedData = await incomingData.json()
        setData({name: preparedData.name, author: preparedData.author, pages: preparedData.pages})

    }
    if(params.book !== undefined && data == null){
        fetchBook(params.book)
    }
    
    return (
        <>
            <h1>books</h1>
            {data !== null ? (<>
            <p>{data.name}</p>
            <p> {data.author} </p>
            <p>{data.pages} </p>
            </>) : (<>
            <p>404</p>
            <p>This is not the webpage you are looking for</p>
            </>)}
            <p>404</p>
        </>                               
    )
}


export default Book
