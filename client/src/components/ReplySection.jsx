import { Button, Textarea } from 'flowbite-react';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function ReplySection({reply,user,onEditReply,onDeleteReply,onLikeReply,comment,setReplies,setNoOfReplies,replies}) {
  console.log(reply)
  const {currentUser} = useSelector((state) => state.user);
 const [isEditing,setIsEditing]=useState(false);
 const [editedContent,setEditedContent]=useState(reply.content);
 const [replyContent,setReplyContent]=useState('');
 const [replyingTo,setReplyingTo]=useState(null);
 const [isReplying,setIsReplying]=useState(false);
 console.log(reply)
  //reply posting
//   const handlePostReply=async()=>{
//     try {
//         const res = await fetch(`/api/comment/postReply/${comment._id}`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             content: replyContent,
//           }),
//         });
//         if (res.ok) {
//           const data=await res.json();
//           setReplies(data,...replies);
//           setIsReplying(false);
//           // onEdit(comment, editedContent);
//         }
//       } catch (error) {
//         console.log(error.message);
//       }
// }

const handleReply=()=>{
  setIsReplying((prevState)=>!prevState);
  setReplyingTo(user.username);
}

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSaveReply = async () => {
    try {
      const res = await fetch(`/api/comment/editReply/${reply?._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editedContent,
        }),
      });
      if (res.ok) {
        setIsEditing(false);
        onEditReply(reply, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handlePostReply=async()=>{
    try {
      setReplyContent('')
        const res = await fetch(`/api/comment/postReply/${comment._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: replyContent,
            replyingTo:replyingTo||null
          }),
        });
        if (res.ok) {
          setNoOfReplies((prevState)=>prevState+1);
          const data=await res.json();
          // setReplies((prevReplies)=>[data,...prevReplies]);
          setReplies([...replies,data]);
          setIsReplying(false)
          // onEdit(comment, editedContent);
        }
      } catch (error) {
        console.log(error.message);
      }
}
  return (
    <div className={` relative flex-col px-6 py-6 w-3/6 ml-5 border-b dark:border-gray-600 text-sm `}>
      <div className='flex-1'>
        <div className='flex items-center mb-1'>
         <div className='flex-shrink-0 mr-3'>
          <img
            className='w-10 h-10 rounded-full bg-gray-200'
            src={user?.profilePicture}
            alt={user?.username}
          />
        </div>
          <span className='font-bold mr-1 text-xs truncate'>
            {user ? `@${user.username}` : 'anonymous user'}
          </span>
          <span className='text-gray-500 text-xs'>
            {moment(reply?.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              className='mb-2 resize-none'
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className='flex justify-end gap-2 text-xs'>
              <Button
                type='button'
                size='sm'
                gradientDuoTone='purpleToBlue'
                onClick={handleSaveReply}
              >
                Save
              </Button>
              <Button
                type='button'
                size='sm'
                gradientDuoTone='purpleToBlue'
                outline
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
          <span className='text-gray-500 pb-2 my-3'><span className='font-bold text-cyan-500 hover:cursor-pointer'>{reply?.replyingTo===null?'':`@${reply.replyingTo} `}</span>{reply.content}</span>
            <div className=' flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
              {/* like button */}
              <button
                type='button'
                onClick={() => onLikeReply(reply._id)}
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  reply.likes.includes(currentUser._id) &&
                  '!text-blue-500'
                }`}
              >
                <FaThumbsUp className='text-sm' />
              </button>
              <p className='text-gray-400'>
                {reply.numberOfLikes > 0 &&
                  reply.numberOfLikes +
                    ' ' +
                    (reply.numberOfLikes === 1 ? 'like' : 'likes')}
              </p>
              {/* <Reply comment={comment} onLike={handleLike} onEdit={handleEdit} onDelete={onDelete}/> */}
              {currentUser &&
                (currentUser._id === reply.user._id || currentUser.isAdmin) && (
                  <>
                    <button
                      type='button'
                      onClick={handleEdit}
                      className='text-gray-400 hover:text-blue-500'
                    >
                      Edit
                    </button>
                    <button
                      type='button'
                      onClick={() => onDeleteReply(reply?._id)}
                      className='text-gray-400 hover:text-red-500'
                    >
                      Delete
                    </button>
                  </>
                )}
                 {/* reply */}
                 <button
                      type='button'
                      onClick={handleReply}
                      className='text-gray-400 hover:text-blue-500'
                    >
                      Reply
                    </button>
            </div>
          </>
        )}
      </div>
      {isReplying &&(
        <>
          <Textarea
            className='mb-2 mt-4'
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder='Add a reply...'
          />
          <div className='flex justify-end gap-2 text-xs'>
            <Button
              type='button'
              size='sm'
              gradientDuoTone='purpleToBlue'
              onClick={()=>handlePostReply(replyContent)}
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
  );
}