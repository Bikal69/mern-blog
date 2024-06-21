import React, { useState } from 'react'

const ReplyTextArea = ({isReplying,setIsReplying}) => {
const [replyContent,setReplyContent]=useState("");
const handlePostReply=async()=>{
    try {
        const res = await fetch(`/api/comment/postReply/${comment._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: replyContent,
          }),
        });
        if (res.ok) {
          setIsReplying(false);
          onEdit(comment, editedContent);
        }
      } catch (error) {
        console.log(error.message);
      }
}

  return (
    <div>
        {isReplying && (
        <>
          <Textarea
            className='mb-2 mt-4'
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <div className='flex justify-end gap-2 text-xs'>
            <Button
              type='button'
              size='sm'
              gradientDuoTone='purpleToBlue'
              onClick={handlePostReply}
            >
              Reply
            </Button>
            <Button
              type='button'
              size='sm'
              gradientDuoTone='purpleToBlue'
              outline
              onClick={() => setIsReplying(false)}
            >
              Cancel
            </Button>
          </div>
        </>
      )}


    </div>
  )
}

export default ReplyTextArea