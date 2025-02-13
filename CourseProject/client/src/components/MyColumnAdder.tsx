import React from 'react'

interface incomingParams {   
    showColumnAdder?: (hide: boolean) => void
}

const MyColumnAdder: React.FC<incomingParams> = ({showColumnAdder}) => {
    // a component where user can add a column
    const addColumn = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        const form = new FormData(document.getElementById("columnForm") as HTMLFormElement)

        const jsonString = JSON.stringify({ // copyPasta is my passion
            name: form.get("name")
        })

        await fetch( '/api/column',{
            method: 'post',
            body: jsonString,
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${localStorage.getItem("sessionToken")}`
            },
        })
        if(showColumnAdder){
            showColumnAdder(false)
        }
    }
    return (
        <> 
            <div>Add a new column</div>
            <form id="columnForm" onSubmit={(e: React.SyntheticEvent) => addColumn(e)}>
                <label>Name: </label><input type='text' name='name'></input>
                <br />
                <input type='submit'></input>
            </form>
        </>
    )
}

export default MyColumnAdder