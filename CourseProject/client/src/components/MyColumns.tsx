import {useState, useEffect} from 'react'
import IColumn from './IColumn'
import CardColumn from './MyCardColumn'
import { Button, Card } from '@mui/material'
import MyColumnAdder from './MyColumnAdder'

const MyColumns = () => {
  // shows all columns
  const [columns, setColumns] = useState<IColumn[] | null | undefined>(undefined) 
  // IColumn [] is the actual value expected to be here, null is when authentication or fetch fails, and undefined is used to indicate that fetch hasn't happend yet thus preventing multiple fetches
  const [addColumn, setAddColumn] = useState<boolean>(false)
  const [causeRerender, setCauseRerender] = useState<number>(0)
  
  const deleteColumn = async (id: string) => { // deletes a column
    const incomingData = await fetch('/api/deleteColumn',
      {method: 'delete',
      body: JSON.stringify({id: id}),
      headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${localStorage.getItem("sessionToken")}`
      },
    })
    if(!incomingData.ok){
      console.log("deleting a card failed", await incomingData.json())
    }
    setCauseRerender(causeRerender => causeRerender + 1) 
  }

  useEffect(() => { // fetches columns by a user
    const abortCtrl: AbortController = new AbortController()

    const fetchColumns= async() => {
      const incomingData = await fetch('/api/columnByUser',
        {
          headers: {
            "authorization": `Bearer ${localStorage.getItem("sessionToken")}`
        }
        },
      )
      if (!incomingData.ok){
        setColumns(null)
        return null
      }
  
      const data: IColumn[] = await incomingData.json()
      setColumns(data)
    }

    fetchColumns()
    return () => abortCtrl.abort()
  }, [addColumn, causeRerender])


  return (
    <div>
      {columns ? columns.map((column) => (
        <div key={column._id}>
          <Card >
            <CardColumn incomingColumn={column} causeHigherRerender={() => setCauseRerender(causeRerender => causeRerender + 1)}/>
            <Button onClick={() => deleteColumn(column._id)} > delete Column </Button> 
          </Card>
          <br />
        </div>
        
      )) : "Either fetch failed and refersh the page or login"}
      {/* button to add a new column*/}
      {addColumn ? <Card> <MyColumnAdder showColumnAdder={setAddColumn}></MyColumnAdder> </Card>: <Card> <Button onClick={() => setAddColumn(true)}> Add column </Button> </Card> }
    </div>
  )
}

export default MyColumns