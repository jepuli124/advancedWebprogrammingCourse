//import { colors } from '@mui/material'
import React, { useState } from 'react'
import ICard from './ICard'

interface incomingParams {
    column: string | null
    cardId?: string 
    cardData?: ICard
    showCardAdder?: () => void
}

const MyCardAdder: React.FC<incomingParams> = ({column, cardId, cardData, showCardAdder}) => {
    // adds cards
    const [columnError, setColumnError] = useState<boolean>(false) // these work as message togglers
    const [success, setSuccess] = useState<boolean>(false)

    const addCard = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        const form = new FormData(document.getElementById("cardForm") as HTMLFormElement)

        const jsonString = JSON.stringify({ // had some problem with getting data out of from inside the fetch function, this fixed it
            name: form.get("name"),
            text: form.get("text"),
            status: form.get("status"),
            column: column ? column : form.get("column"), //uses given column when adding straight to column
            timeToComplete: form.get("timeToComplete"),
            timeSpend: form.get("timeSpend"),
            colour: form.get("colour"),
            cardId: cardId ? cardId : null
        })

        const incomingData = await fetch( '/api/card',{
            method: cardId ? 'put' : 'post',
            body: jsonString,
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${localStorage.getItem("sessionToken")}`
            },
        })
        if(!incomingData.ok){
            const preparedData = await incomingData.json()
            if (preparedData.message == "Column not found"){
                setColumnError(true)
            }
            setSuccess(false)
        } else {
            setSuccess(true)
            setColumnError(false)
        }

        if(showCardAdder){
            showCardAdder()
        }
    }

    return (
        <>
            <div>Add a new card</div>
            <form id="cardForm" onSubmit={(e: React.SyntheticEvent) => addCard(e)}>
                <label>Name: </label><input type='text' name='name' defaultValue={cardData ? cardData.name : ""}></input>
                <br />
                <label>Text: </label><input type='text' name='text' defaultValue={cardData ? cardData.text : ""}></input>
                <br />
                <label>Status: </label><input type='text' name='status' defaultValue={cardData ? cardData.status : ""}></input>
                <br />
                {column ? <></> : <><label>Column: </label><input type='text' name='column' ></input>
                <br /></>}
                <label>Estimated time to complete (in hours): </label><input type='number' name='timeToComplete' defaultValue={cardData ? cardData.timeToComplete : ""}></input>
                <br />
                <label>Time used to this (in hours): </label><input type='number' name='timeSpend' defaultValue={cardData ? cardData.timeSpend : ""}></input>
                <br />
                <label>Colour (in hex): </label><input type='string' name='colour' defaultValue={cardData ? cardData.colour : "#ffffff"}></input>
                <br />
                <input type='submit'></input>
            </form>
            {columnError? <p>Column doesn't exist</p> : <></>}
            {success? <p>card was succesfully added</p> : <></>}
        </>
    )
}

export default MyCardAdder