import { Button } from '@mui/material'
import {useEffect, useState} from 'react'
import Card from '@mui/material/Card';
import JokeData from './jokeData';
//import CardContent from '@mui/material/CardContent';



interface FrontPageProps {
    saveJoke?: (newJoke: JokeData) => void;
}

const FrontPage: React.FC<FrontPageProps> = ({saveJoke}) => {
    const url = "https://official-joke-api.appspot.com/random_joke"
    
    const [data, setData] = useState<JokeData>({type:"", setup:"", punchline:"", id:0})
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>("")
    const [callUseEffect, setCallUseEffect] = useState<number>(0)

    useEffect(() => {
        const abortCtrl: AbortController = new AbortController()

        const fetchData = async () => {
            setData({type:"", setup:"", punchline:"", id:0})
            setLoading(true)
            setError("")
            try {
                const response: Response = await fetch(url, {signal: abortCtrl.signal})
                if (!response.ok) {
                    throw new Error("Failed to fetch data!")
                }
                const data: JokeData = await response.json()
                console.log(data)
                setData(data)
                setLoading(false)

            } catch (error: unknown) {
                if (error instanceof Error) {
                    if (error.name === "AbortError") {
                        console.log("Fetch aborted")
                    } else {
                        setError(error.message)
                    }
                    setLoading(false)
                }
            }
        }
        console.log("useEffectWasRun")
        fetchData()
        return () => abortCtrl.abort()

    }, [callUseEffect])

  return (
    <div>
        FrontPage
        <Button onClick={() => {
            setData({type:"", setup:"", punchline:"", id:0})
            setCallUseEffect(callUseEffect+ 1)
            }}>Get Joke</Button>
        {loading ? (<p>Loading a joke...</p> ) : ( data && (
        <div>
        <Card variant="outlined" key={data?.id.toString()}><p>{data?.setup}</p><p>{data?.punchline}</p></Card>
        <Button onClick={() => {
        const newJoke: JokeData = {type: data.type, setup: data.setup, punchline: data.punchline, id: data.id}
        if(saveJoke){
            saveJoke(newJoke)}
        }}>Save Joke</Button>
        </div> ))}
        {error && <p>{error}</p>}
    </div>                                  
  )
}


export default FrontPage
