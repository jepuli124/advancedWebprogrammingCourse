import { useState } from 'react'
import React from 'react';
import './MyList'
import MyList from './MyList';

type TItem = {
    id: string,
    text: string,
    clicked: false
}

interface IMyContainer {
    items?: TItem[]
}


const MyContainer: React.FC<IMyContainer> = () => {
    //console.log("hehei", myCont.items)
    const [items, setItems] = useState<TItem[]>([
        {id: '1', text: 'funni', clicked: false},
        {id: '2', text: 'extra funni', clicked: false},
    ])

    //setItems(myCont.items)
    if (items == undefined){
         return (
         <div>
            <textarea></textarea>
            <button></button>
        </div>)
    }

    return (
        <div>
            <MyList header={"header"} items={items}/>
            <textarea id="inputTextArea"></textarea>
            <button onClick={() => {
                const inputArea: HTMLInputElement = document.getElementById("inputTextArea") as HTMLInputElement
                setItems([{id: '23', text: inputArea.value, clicked: false}, ...items])
            }}>add</button>
        </div>
    )
}


export default MyContainer