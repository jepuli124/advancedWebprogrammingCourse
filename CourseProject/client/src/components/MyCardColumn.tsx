import React, { useEffect, useState } from 'react'
import ICard from './ICard'
import IColumn from './IColumn'
import MyCard from './MyCard'
import { Button, Card } from '@mui/material'
import MyCardAdder from './MyCardAdder'
import DropPlace from './DropPlace'



interface incomingData{
  incomingColumn: IColumn
  fetchCards?: boolean
  causeHigherRerender?: () => void // different for the different views
  causeAdminRerender?: () => void
}

const CardColumn: React.FC<incomingData> = ({incomingColumn, fetchCards = true, causeHigherRerender, causeAdminRerender}) => {
  // column that stores all cards
  const [addCard, setAddCard] = useState<boolean>(false)
  const [cards, setCards] = useState<ICard[]>([])
  const [causeRerender, setCauseRerender] = useState<number>(0)
  const [rename, setRename] = useState<boolean>(false)

  const deleteCard = async (id: string) => { // deletes a card and then rerenders the page
    const incomingData = await fetch('/api/deleteCard',
      {method: 'delete',
      body: JSON.stringify({id: id}),
      headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${localStorage.getItem("sessionToken")}`
      },
    })
    if(!incomingData.ok){
      console.log("deleting a card failed")
    }
    setCauseRerender(causeRerender => causeRerender + 1) // https://stackoverflow.com/questions/46240647/react-how-to-force-to-re-render-a-functional-component/53837442#53837442
  }

  const renameColumn = async (e: React.SyntheticEvent) => { //renames a column
    e.preventDefault()
    // rename + incomingColumn._id is always an unique id for the form
    const form = new FormData(document.getElementById("rename"+incomingColumn._id) as HTMLFormElement)
    const name = form.get("name") as string
    if (!name) {
      setRename(false)
      console.log("please don't enter empty name")
      return
    }
    const jsonString = JSON.stringify({ 
      name: name,
      columnId: incomingColumn._id, //uses given column id 
    })

    const incomingData = await fetch('/api/column',
      {method: 'put',
      body: jsonString,
      headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${localStorage.getItem("sessionToken")}`
      },
    })
    if(!incomingData.ok){
      console.log("renaming the column has failed")
    }
    setRename(false)
    incomingColumn.name = name
  }

  const moveCard = async(placeIndex: number, column: string, dropCardId: string) => {
    //moves a card, works even from column to column
    const jsonString = JSON.stringify({ 
      placeIndex: placeIndex,
      dropCardId: dropCardId,
      column: column
    })
    const incomingData = await fetch('/api/moveCard',
      {method: 'put',
      body: jsonString,
      headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${localStorage.getItem("sessionToken")}`
      },
    })
    if(!incomingData.ok){
      console.log("oh noes, fetch after moving didn't work")
      return
    }

    if(causeHigherRerender){
      causeHigherRerender()
    }
    setCauseRerender(causeRerender => causeRerender + 1)
    return
  }

  useEffect(() => {
    if(!fetchCards) {
      return
    }
    const abortCtrl: AbortController = new AbortController()

    const reFetch = async () => { // a function to fetch new cards after editing, moving or changing a card.
      const incomingData = await fetch('/api/cardsByColum', { 
        method: 'post',
        body: JSON.stringify({columnId: incomingColumn._id}),
        headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${localStorage.getItem("sessionToken")}`
        },
      })
  
      if (!incomingData.ok){
        console.log("Fetch failed")
        return null
      }
  
      const data: ICard[] = await incomingData.json()

      data.sort((card1, card2) => { // taken from https://stackoverflow.com/questions/21687907/typescript-sorting-an-array
        if(card1.index < 0 && card2.index < 0){ return 0 }

        if(card2.index < 0){ return -1 }

        if(card1.index < 0 ){ return 1 }

        if (card1.index > card2.index) { return 1; }

        if (card1.index < card2.index) { return -1 }
    
        return 0;
      })
      setCards(data)
    }

    reFetch()
    return () => abortCtrl.abort()
  }, [incomingColumn, fetchCards, addCard, causeRerender])

  const reRenderFromBelow = () => { // function to pass below to cause refersh, also sets card adding off
    setAddCard(false)
    setCauseRerender(causeRerender => causeRerender + 1)
    if(causeAdminRerender){
      causeAdminRerender()
    }
    return
  }

  return (
    <Card>
      {/* displays the column name, when it is doubleclicked changes to form where user can rename the column */}
      {rename ? <form id={'rename'+incomingColumn._id} onSubmit={(e: React.SyntheticEvent) => renameColumn(e)}> <input type="text" name="name" defaultValue={incomingColumn.name}></ input> <input type='submit'></input> </form> : <h1 onDoubleClick={() => setRename(true)}>{incomingColumn.name}</h1>}
      {/* place to drop cards into columns*/}
      <DropPlace cardIndex={0} column={incomingColumn._id} moveCard={moveCard}></DropPlace>
        {cards.length > 0 ? cards.map((cardData) => (
          <div key={cardData._id}>
            {/* place to drop cards into place of other cards columns*/}
            <DropPlace cardIndex={cardData.index} column={incomingColumn._id} moveCard={moveCard}></DropPlace>
            <Card variant="outlined" style={{
              backgroundColor: cardData.colour
            }}>
              <MyCard cardData={cardData} reRenderHigher={reRenderFromBelow}/>
              <Button onClick={() => deleteCard(cardData._id)}>- Delete -</Button>
            </Card>
          </div>
          )) : ""}
        {/* shows normaly a button that when clicked opens a form where client can add a card */}
        {addCard ? <MyCardAdder column={incomingColumn.name} showCardAdder={reRenderFromBelow}></MyCardAdder> 
        : <Button onClick={() => setAddCard(true)}> + add card + </Button> }
    </Card>
  )
}

export default CardColumn