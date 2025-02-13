import React from 'react'
import { useDrop } from 'react-dnd'
import { ItemTypes } from './DragItemTypes'

interface incomingParams {
    cardIndex: number,
    column: string,
    moveCard?: (cardIndex: number, column: string, dropCardId: string) => Promise<void>
}

const DropPlace: React.FC<incomingParams> = ({cardIndex, column, moveCard}) => { 
  // the drop box, waits that draggable item is dropped here and then calls moveCard function to update the movement in client and index in the server.  
    const [{ isOver }, drop] = useDrop( // https://react-dnd.github.io/react-dnd/docs/tutorial#adding-drag-and-drop-interaction 
        () => ({
          accept: ItemTypes.CARD,
          drop: (item: {id: string}) => {if(moveCard) moveCard(cardIndex, column, item.id)},
          collect: (monitor) => ({
            isOver: !!monitor.isOver()
          })
        }),
        [cardIndex]
      )
    return ( drop(
        <div >
            {isOver ? <p> drop here </p> : <br />}
        </div>
    ) )
}

export default DropPlace