import React, { useState } from 'react'
import IComment from './IComment'
import { Card } from '@mui/material'
import MyAddComment from './MyAddComment'

interface incomingParams {
    commentData: IComment
    causeHigherRender?: () => void 
    adminView?: boolean
}


const MyComment: React.FC<incomingParams> = ({commentData, causeHigherRender, adminView}) => {
    // shows a comment, 
    const [editComment, setEditComment] = useState<boolean>(false)

    return (
        <div onDoubleClick={() => setEditComment(true)}>
            {editComment ? 
            <> 
                <MyAddComment cardId={commentData.post} commentData={commentData} showCommendAdder={() => {
                    setEditComment(false)
                    if(causeHigherRender){
                        causeHigherRender()
                    }
                }
                }></MyAddComment>
            </>
                : 
            
            <Card variant="outlined" >
                <p>Comment: {commentData.text}</p>
                {adminView ? <p>On post: {commentData.post}</p> : <></>}
                <p>By: {commentData.posterName} </p>
                <p>created/edited at: {commentData.createdAt}</p>
            </Card>}
        </div>
    )
}

export default MyComment