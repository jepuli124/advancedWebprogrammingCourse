import React from 'react';
import CSS from "csstype";
import { useState } from 'react';

type IItem = {
    id: string,
    text: string,
    clicked: boolean
}

interface IList {
    header: string,
    items: IItem[],
}

const MyList: React.FC<IList> = ({header, items}) => {
    const [count, setCount] = useState(0);
    
    const lineStyle: CSS.Properties = { // https://oida.dev/typescript-react/styles/
        textDecoration: "line-through"
      };
    return (
        <div>
            <h1>{header}</h1>
            <ol>
                {items.map((item) =>(
                    <li onClick={() => {
                        item.clicked = true
                        setCount(1)
                        console.log("li clicked", item)
                    }} style={count ? lineStyle : undefined} 
                    className={count? "lineStyle" : undefined}>{item.text}</li>
                ))}
            </ol>
        </div>
    )
}


export default MyList