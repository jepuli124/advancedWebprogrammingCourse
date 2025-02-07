import React, { useEffect } from 'react';
import { useState } from 'react'
import '../styles/About.css'


interface IAbout {
    text?: string 
}

type TObject = {
    title: string,
    body: string,
    id: number
} 

const About: React.FC<IAbout> = () => {
    const [page, setPage] = useState(0)
    const [objects, setObjects] = useState<TObject[]>([])


    useEffect(() => {
        fetch("https://jsonplaceholder.typicode.com/posts")
        .then(response => response.json())
        .then(data => {
            const newList: TObject[] = []

            data.forEach((element: { title: string; body: string; id: number; }) => {
                if(element.id <= (page + 1)* 12){
                    newList.push({title: element.title, body: element.body, id: element.id})
                }
                
            });

            setObjects(newList)
        })
    }, [page])

    return (
        <div>
            <div className='grid-container'>
                {objects.map((item) => (
                    <div key={item.id.toString()} className='grid-item'>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                    </div>
                ))}
            </div>
            <button onClick={() => setPage(page + 1)}> SHOW MORE  {page}</button>
        </div>
        
    )
}
// https://jsonplaceholder.typicode.com/posts

export default About