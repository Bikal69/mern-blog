import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { FaThumbsUp,FaAngleUp,FaAngleDown} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Button, Modal, Textarea } from 'flowbite-react';
import ReplySection from './ReplySection';
import { Spinner } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
// import Reply from './Reply';

export default function Comment({ comment, onLike, onEdit, onDelete }) {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying,setIsReplying]=useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const {currentUser} = useSelector((state) => state.user);
  const [replyContent,setReplyContent]=useState('');
  const [replies,setReplies]=useState([]);
  const [showReplies,setShowReplies]=useState(false);
  const [showMoreReplies,setShowMoreReplies]=useState(true);
  const [noOfReplies,setNoOfReplies]=useState(comment.replies.length)
  const [loading,setLoading]=useState(false);
  const navigate=useNavigate();
  const [showDeleteModal,setShowDeleteModal]=useState(false);
  const [replyToDelete,setReplyToDelete]=useState(null);
  const noOfRepliesOnDbInitially=comment.replies.length;
  useEffect(() => {
    //fetch commenter details
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
   getUser();
  }, [comment._id]);
    //get comment replies
  useEffect(()=>{
    const getReplies=async()=>{
      try{
        const res=await fetch(`/api/comment/getReplies/${comment._id}`);
        if(res.ok){
          const replyData=await res.json();
          setReplies(replyData);
        }
      }
      catch(error){
        console.log("i got error")
        console.log(error);
      }
    };
    getReplies();
  },[]);
 
  //reply posting
  const handlePostReply=async(replyContent)=>{
    try {
      setReplyContent('')
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
          setNoOfReplies((prevState)=>prevState+1);
          const data=await res.json();
          setReplies([...replies,data]);
          setIsReplying(false)
        }
      } catch (error) {
        console.log(error.message);
      }
}

const handleReply=()=>{
  setIsReplying((prevState)=>!prevState);
}
  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
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
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleShowMoreReplies=async()=>{
    const numberOfReplies=replies.length;
    const startIndex=numberOfReplies;
    setLoading(true);
    const res=await fetch(`/api/comment/getReplies/${comment._id}?startIndex=${startIndex}`);
    if(!res.ok){
      return;
    }
    if(res.ok){
      const data=await res.json();
      setLoading(false);
      setReplies([...replies,...data]);
      if(data.length===5){
        setShowMoreReplies(true);
      }else{
        setShowMoreReplies(false);
      }
    }
  }
  //handle edit reply funcion
  const  handleEditReply=(reply,editedReplyContent)=>{
    setReplies(
      replies.map((r)=>
        r._id===reply._id?{...r,content:editedReplyContent}:r
      )
    )
  }
  //handle delete reply function
  const handleDeleteReply = async (replyId) => {
    setShowDeleteModal(false);
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }
      const res = await fetch(`/api/comment/deleteReply/${replyId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const data = await res.json();
        setReplies(replies.filter((reply) => reply._id !== replyId));
        setNoOfReplies((prevState)=>prevState-1);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleLikeReply = async (replyId) => {
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }
      const res = await fetch(`/api/comment/likeReply/${replyId}`, {
        method: 'PUT',
      });
      if (res.ok) {
        const data = await res.json();
        setReplies(
          replies.map((reply) =>
            reply._id === replyId
              ? {
                  ...reply,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : reply
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
       <div className='flex-shrink-0 mr-3'>
          <img
            className='w-10 h-10 rounded-full bg-gray-200'
            src={user.profilePicture}
            alt={user.username}
          />
        </div>
      <div className='flex-1'>
        <div className=' flex items-center mb-1 '>
          <span className='font-bold mr-1 text-xs truncate'>
            {user ? `@${user.username}` : 'anonymous user'}
          </span>
          <span className='text-gray-500 text-xs'>
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              className='mb-2'
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className='flex justify-end gap-2 text-xs'>
              <Button
                type='button'
                size='sm'
                gradientDuoTone='purpleToBlue'
                onClick={handleSave}
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
            <p className='text-gray-500 pb-2'>{comment.content}</p>
            <div className=' flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
              {/* like button */}
              <button
                type='button'
                onClick={() => onLike(comment._id)}
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  '!text-blue-500'
                }`}
              >
                <FaThumbsUp className='text-sm' />
              </button>
              <p className='text-gray-400'>
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    ' ' +
                    (comment.numberOfLikes === 1 ? 'like' : 'likes')}
              </p>
              {/* <Reply comment={comment} onLike={handleLike} onEdit={handleEdit} onDelete={onDelete}/> */}
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
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
                      onClick={() => onDelete(comment._id)}
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
     {isReplying && (
        <>
          <Textarea
            className='mb-2 mt-4 '
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
        {
         (currentUser)&& replies?.length>0?(
            <>
             <div className='relative top-3 left-5 hover:bg-blue-200 w-32 h-8 rounded-md hover:cursor-pointer'>
            <p className=' text-blue-500 font-semibold  flex select-none' onClick={()=>setShowReplies((prev)=>!prev)}>
              {showReplies?(<FaAngleUp className='text-md'/>):(<FaAngleDown/>)}{`view replies(${noOfReplies})`}
            </p>
            </div>
            </>
          ):(currentUser)&&(
            <>
            No reply
            </>
          )
        }
         {
          showReplies && replies.map((reply)=>{
            console.log("mapping")
         return <ReplySection key={reply._id} reply={reply} user={reply.user} onEditReply={handleEditReply} onDeleteReply={(replyId)=>{
          setShowDeleteModal(true);
          setReplyToDelete(replyId)
         }} onLikeReply={handleLikeReply} comment={comment} setReplies={setReplies} setNoOfReplies={setNoOfReplies} replies={replies}/>
        })
      }
      {
        loading&&<Spinner className='text-lg block ml-8'/>
      }
      {
        showReplies&&noOfRepliesOnDbInitially>5&&(showMoreReplies?(<button className='text-md font-bold text-black-400 bg-cyan-50 hover:bg-cyan-100 rounded-md p-1 ml-5 mt-3  cursor-crosshair' onClick={handleShowMoreReplies}>Show More Replies</button>):(<></>))
      }
      </div>
      <Modal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this reply?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button
                color='failure'
                onClick={() => handleDeleteReply(replyToDelete)}
              >
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowDeleteModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}