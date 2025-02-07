import {useState} from 'react'

import JokeData from '../components/jokeData';

export const useJokes = () => {
    
    const [savedJokes, setJokes] = useState<JokeData[]>([])
    
    // const returnJokes = () => {
    //     console.log("returning jokes", jokes)
    //     return jokes
    // } 

    const saveJoke = (newJoke: JokeData) => {
        setJokes([...savedJokes, newJoke])
        console.log("new joke saved", newJoke, savedJokes)
    }
    
    const deleteJoke = (id: number) => {
        const newJokes: JokeData[] = [] 
        for (let index = 0; index < savedJokes.length; index++) {
            const element = savedJokes[index];
            if (element.id !== id){
                newJokes.push(element)
            }
        }
        setJokes(newJokes)
    }

    return {savedJokes, saveJoke, deleteJoke}
}