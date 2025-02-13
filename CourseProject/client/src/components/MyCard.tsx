import React, { useState, useEffect } from 'react'
import ICard from './ICard'
import IComment from './IComment'
import { Card, Button } from '@mui/material'
import MyAddComment from './MyAddComment'
import { useDrag } from 'react-dnd'
import { ItemTypes } from './DragItemTypes'
import MyCardAdder from './MyCardAdder'
import MyComment from './MyComment'

interface IncominParams{
  cardData: ICard,
  reRenderHigher?: () => void, // different since admin view and normal view differ.
  reRenderAdmin?: () => void
}

const MyCard: React.FC<IncominParams> = ({ cardData, reRenderHigher, reRenderAdmin }) => { // generic display data function

  const [comments, setComments] = useState<IComment[]>([])
  const [addComment, setAddComment] = useState<boolean>(false)
  const [editCard, setEditCard] = useState<boolean>(false)
  const [causeRerender, setCauseRerender] = useState<number>(0)

  useEffect(() => {
    const abortCtrl: AbortController = new AbortController()

    const fetchComments = async () => { // a function to fetch new comments after adding a comment.
      const incomingData = await fetch('/api/commentsByCard', { 
        method: 'post',
        body: JSON.stringify({commentRelatedId: cardData._id}),
        headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${localStorage.getItem("sessionToken")}`
        },
      })
  
      if (!incomingData.ok){
        console.log("Fetch failed")
        return null
      }
  
      const data: IComment[] = await incomingData.json()
      setComments(data)
    }
    fetchComments()
    return () => abortCtrl.abort()
  }, [cardData._id, causeRerender])

  


  const [{ isDragging }, drag] = useDrag(() => ({ // https://react-dnd.github.io/react-dnd/docs/tutorial#adding-drag-and-drop-interaction 
    type: ItemTypes.CARD,
    item: {id: cardData._id},
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }))

  return ( // https://stackoverflow.com/questions/78220589/usedrag-ref-type-error-with-nextjs-and-react-dnd 
    drag (
    <div 
      style={{ // show opaque copy of dragable card
        opacity: isDragging ? 0.5 : 1,
        fontSize: 25,
        fontWeight: 'bold',
        cursor: 'move'
      }}>
        <div>
        {editCard ? 
      <>
        <MyCardAdder column={cardData.column} cardId={cardData._id} cardData={cardData} showCardAdder={() => { 
          // when card is added, calls these
          setEditCard(false) 
          if(reRenderHigher){
            reRenderHigher()
          }
          }}></MyCardAdder>
      </>
      : 
      <>
        <div onDoubleClick={() => setEditCard(true)}>
        <h1>{cardData.name}</h1>
          <h3>{cardData.status}</h3>
          <p>{cardData.text}</p>
          {cardData.timeToComplete ? <p>Time to complete: {cardData.timeToComplete} h</p> : <></>}
          {cardData.timeSpend ? <p>Time spend: {cardData.timeSpend} h</p> : <></>}
          <p>Created/edit at: {(cardData.createTime as unknown) as string}</p> {/* dont know why first unknown and the string, but visual code recomended this and I did it */}
        </div>
        
        {(comments.length > 0 && !reRenderAdmin)? comments.map((comment) => ( /* only in non admin view*/
            <Card variant="outlined" key={comment._id}>
              <MyComment commentData={comment} causeHigherRender={
                () => {
                  setCauseRerender(causeRerender => causeRerender + 1)
                  if(reRenderHigher)
                    {
                      reRenderHigher()
                    }
                }
                }></MyComment>
            </Card>
          )) : ""}
        {addComment ? <MyAddComment cardId={cardData._id} showCommendAdder={() => {
          // when comment is added, calls these
          setAddComment(false)
          setCauseRerender(causeRerender => causeRerender + 1)
          if(reRenderAdmin) {
            reRenderAdmin()
          }
        }}></MyAddComment> : <Button onClick={() => setAddComment(true)}> Add comment </Button> /* activates comment add element */}
      </> 
      }
      </div>
    </div>
  ) )
}

export default MyCard