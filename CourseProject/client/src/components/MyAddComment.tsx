import React from 'react'
import IComment from './IComment'

interface incomingParams {
    cardId: string | null,
    commentData?: IComment 
    showCommendAdder?: () => void
}

const MyAddComment:React.FC<incomingParams> = ({cardId, commentData, showCommendAdder}) => {
    // adds comment
    const addComment = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        const form = new FormData(document.getElementById("commentForm") as HTMLFormElement)

        const jsonString = JSON.stringify({ // had some problem with getting data out of from inside the fetch function, this fixed it
            post: cardId,
            text: form.get("text"),
            commentId: commentData?._id
        })

        await fetch( '/api/comment',{
            method: commentData? 'put' : 'post',
            body: jsonString,
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${localStorage.getItem("sessionToken")}`
            },
        })
        if(showCommendAdder){
            showCommendAdder()
        }
    }
    return (
        <>
            <div>Add a comment card</div>
            <form id="commentForm" onSubmit={(e: React.SyntheticEvent) => addComment(e)}>
                <label>Your comment: </label><input type='text' name='text' defaultValue={commentData? commentData.text : ""}></input>
                <br />
                <input type='submit'></input>
            </form>
        </>
    )
}

export default MyAddComment