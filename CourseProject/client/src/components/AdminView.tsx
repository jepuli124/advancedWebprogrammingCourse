import { Button, Card } from '@mui/material'
import React, { useEffect, useState } from 'react'
import IUser from './IUser'
import IColumn from './IColumn'
import ICard from './ICard'
import IComment from './IComment'
import CardColumn from './MyCardColumn'
import MyCard from './MyCard'
import MyComment from './MyComment'

interface incomingParams{
    incomingColumn?: string
  }


const AdminView: React.FC<incomingParams> = () => {
    const [users, setUsers] = useState<IUser[]>([])
    const [columns, setColumns] = useState<IColumn[]>([])
    const [cards, setCards] = useState<ICard[]>([])
    const [comments, setComments] = useState<IComment[]>([])
    const [causeRerender, setCauseRerender] = useState<number>(0)

    const deleteUser = async (id: string) => { // deletes user
        const incomingData = await fetch('/api/deleteUser',
        {method: 'delete',
        body: JSON.stringify({id: id}),
        headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${localStorage.getItem("sessionToken")}`
        },
        })
        if(!incomingData.ok){
            console.log("deleting a user failed")
        }
        setCauseRerender(causeRerender => causeRerender + 1) // refetch was done to synchronize the client with server, even if deleting fails 
    }

    const deleteColumn = async (id: string) => { // deletes column
        const incomingData = await fetch('/api/deleteColumn',
        {method: 'delete',
        body: JSON.stringify({id: id}),
        headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${localStorage.getItem("sessionToken")}`
        },
        })
        if(!incomingData.ok){
            console.log("deleting a column failed")
        }
        setCauseRerender(causeRerender => causeRerender + 1) // refetch was done to synchronize the client with server, even if deleting fails
    }

    const deleteCard = async (id: string) => { // deletes card 
        const incomingData = await fetch('/api/deleteCard',
        {method: 'delete',
        body: JSON.stringify({id: id}),
        headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${localStorage.getItem("sessionToken")}`
        },
        })
        if(!incomingData.ok){
            console.log("deleting a user failed")
        }
        setCauseRerender(causeRerender => causeRerender + 1) // refetch was done to synchronize the client with server, even if deleting fails
    }

    const deleteComment = async (id: string) => { // deletes comment
        const incomingData = await fetch('/api/deleteComment',
        {method: 'delete',
        body: JSON.stringify({id: id}),
        headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${localStorage.getItem("sessionToken")}`
        },
        })
        if(!incomingData.ok){
            console.log("deleting a user failed")
        }
        setCauseRerender(causeRerender => causeRerender + 1) // refetch was done to synchronize the client with server, even if deleting fails //was originally calling reFetch() when use effect wasn't used
    }

    useEffect(() => { // used to refersh all elements
        const abortCtrl: AbortController = new AbortController()

        const reFetchUsers = async () => { // a function to fetch new users after editing or changing a user.
            const incomingData = await fetch('/api/users', { 
                method: 'get',
                headers: {
                    "authorization": `Bearer ${localStorage.getItem("sessionToken")}`
                },
            })
        
            if (!incomingData.ok){
                console.log("Fetch failed")
                return null
            }
        
            const data: IUser[] = await incomingData.json()
            setUsers(data)
        }

        const reFetchColumns = async () => { // a function to fetch new columns after editing or changing a column.
            const incomingData = await fetch('/api/columns', { 
                method: 'get',
                headers: {
                    "authorization": `Bearer ${localStorage.getItem("sessionToken")}`
                },
            })
        
            if (!incomingData.ok){
                console.log("Fetch failed")
                return null
            }
        
            const data: IColumn[] = await incomingData.json()
            setColumns(data)
            
        }

        const reFetchCards = async () => { // a function to fetch new cards after editing or changing a card.
            const incomingData = await fetch('/api/cards', { 
                method: 'get',
                headers: {
                    "authorization": `Bearer ${localStorage.getItem("sessionToken")}`
                },
            })
        
            if (!incomingData.ok){
                console.log("Fetch failed")
                return null
            }
        
            const data: ICard[] = await incomingData.json()
            setCards(data)
            
        }

        const reFetchComments = async () => { // a function to fetch new comment after editing or changing a comment.
            const incomingData = await fetch('/api/comments', { 
                method: 'get',
                headers: {
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

        reFetchUsers()
        reFetchColumns()
        reFetchCards()
        reFetchComments()
        return () => abortCtrl.abort()
        }, [causeRerender]) 
    // updates when causeRerender changes, all call setCauseRerender to update the site, even child components.

    return (
        <Card>
            <h1>All Data</h1>
            <h2>Users</h2>
            {users.length > 0 ? users.map((user) => (
                <Card variant="outlined" key={user._id}>
                    <p>{user.username}: {user._id}</p>
                    <Button onClick={() => deleteUser(user._id)}>Delete</Button>
                </Card>
                )) : ""}
            <h2>Columns</h2>
            {columns.length > 0 ? columns.map((column) => (
                <Card variant="outlined" key={column._id}> {/* setCauseRerender(causeRerender => causeRerender + 1) instead of setCauseRerender(causeRerender + 1) apparently causes rerender always happen // https://stackoverflow.com/questions/46240647/react-how-to-force-to-re-render-a-functional-component/53837442#53837442 */}
                    <CardColumn incomingColumn={column} fetchCards={false} causeAdminRerender={() => setCauseRerender(causeRerender => causeRerender + 1)}></CardColumn>
                    <Button onClick={() => deleteColumn(column._id)}>Delete</Button>
                </Card>
                )) : ""}
            <h2>Cards</h2>
            {cards.length > 0 ? cards.map((card) => (
                <Card variant="outlined" key={card._id}> {/* admin rerender and reRender are different functions for the reason that admin view acts different from default view*/}
                    <MyCard cardData={card} reRenderHigher={() => setCauseRerender(causeRerender => causeRerender + 1)} reRenderAdmin={() => setCauseRerender(causeRerender => causeRerender + 1)}></MyCard>
                    <Button onClick={() => deleteCard(card._id)}>Delete</Button>
                </Card>
                )) : ""}
            <h2>Comments</h2>
            {comments.length > 0 ? comments.map((comment) => (
                <div key={comment._id} >
                    <MyComment commentData={comment} causeHigherRender={() => setCauseRerender(causeRerender => causeRerender +1)}></MyComment>
                    <Button onClick={() => deleteComment(comment._id)}>Delete</Button>
                </div>
                
                )) : ""}
        </Card>
    )
}

export default AdminView