import React from 'react'
import Card from '@mui/material/Card';
import { Button } from '@mui/material';
import JokeData from './jokeData';

interface SavedPageProps {
    deleteJoke?: (id: number) => void
    savedJokes?: JokeData[]
}


const SavedPage: React.FC<SavedPageProps> = ({deleteJoke, savedJokes}) => {
    let jokes: JokeData[] = []
    if(savedJokes){
        jokes = savedJokes
    }
    
    return (
        <div>
            SavedPage
            <Card variant="outlined">{jokes.length > 0 ? jokes.map((joke) => (
                    <div key={joke.id.toString()} className='grid-item'>
                    <p>{joke.setup}</p>
                    <p>{joke.punchline}</p>
                    <Button onClick={() => {
                        if(deleteJoke){
                            deleteJoke(joke.id)
                        }
                        }}>Delete</Button>
                    </div>
                )) : "No saved jokes yet."}
                
            </Card>    
        </div>
    )
}

export default SavedPage
