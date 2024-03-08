import { Table, TableHead,Spinner, Button, Modal,Toast } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { HiOutlineExclamationCircle,HiX } from 'react-icons/hi';
import {useSelector} from 'react-redux'

export default function DashComments() {
  const {currentUser}=useSelector((state)=>state.user);
  const [showToast, setShowToast] = useState(false);
  const [comments,setcomments]=useState([]);
  const [showMore,setShowMore]=useState(false);
  const  [showMoreLoading,setShowMoreLoading]=useState(false);
  const [showModal,setShowModal]=useState(false);
const [CommentIdToDelete,setCommentIdToDelete]=useState('')
  useEffect(()=>{
const fetchComments=async()=>{
 
  try{
    const res=await fetch(`/api/comment/getComments`)
    const data=await res.json()
if(res.ok){
  setcomments(data.comments)
  if(data.comments.length<9){
    setShowMore(false);
    return;
  }
  setShowMore(true);
}
  }catch(error){
    console.log(error.message)
  }
}
if(currentUser.isAdmin){
  fetchComments();
}
  },[currentUser._id]);
  const handleShowMore=async()=>{
    const startIndex=comments.length;
    setShowMoreLoading(true)
    try{
const res=await fetch( `/api/comment/getComments?startIndex=${startIndex}`);
const data=await res.json();
setShowMoreLoading(false)
if(res.ok){
  setcomments((prev)=>[...prev,...data.comments]);
  if(data.comments.length<9){
    setShowMore(false);
  }
}
    }catch(error){
      console.log(error)
    }
  }
  //delete post function
  const handleDeleteComment=async()=>{
setShowModal(false);
try{
const res=await fetch(`/api/comment/deleteComment/${CommentIdToDelete}`,{
  method:'DELETE',
});
const data=await res.json();
if(!res.ok){
console.log(data.message)
}else{
  setShowToast(true);
  setcomments((prev)=>prev.filter((comment)=>comment._id!==CommentIdToDelete));
}
}catch(error){
  
}
  }
  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin&&comments.length>0?(
        <>
        <Table hoverable className='shadow-md'>
          <Table.Head>
          <Table.HeadCell>DATE UPDATED</Table.HeadCell>
          <Table.HeadCell>COMMENT CONTENT</Table.HeadCell>
          <Table.HeadCell>NUMBER OF LIKES</Table.HeadCell>
          <Table.HeadCell>POSTID</Table.HeadCell>
          <Table.HeadCell>USERID</Table.HeadCell>
          <Table.HeadCell><span>DELETE</span></Table.HeadCell>
          </Table.Head>
        {comments.map((comment)=>(
          <Table.Body key={comments._id} className='divide-y'>
            <Table.Row className=' bg-white dark:border-gray-700 dark:bg-gray-800'>
              <Table.Cell>
                {new Date(comment.updatedAt).toLocaleDateString()}
              </Table.Cell>
              <Table.Cell>
                 {comment.content}
              </Table.Cell>
              <Table.Cell>
                {comment.numberOfLikes}
              </Table.Cell>
              <Table.Cell>
                {comment.postId}
              </Table.Cell>
              <Table.Cell className='text-teal-500 '>
                {comment.userId}
              </Table.Cell>
              <Table.Cell>
                <span onClick={()=>{
                    setShowModal(true);
                    setCommentIdToDelete(comment._id);
                }} className='font-medium text-red-500 cursor-pointer hover:underline'>Delete</span>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        ))}
        </Table>
        {
          showMore&&(
            <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>
              {showMoreLoading?<Spinner size='md'/>:' Show More'}
            </button>
          )
        }
        </>
      ):(<p>No comments to show</p>)}
       <Modal show={showModal} onClose={()=>setShowModal(false)} popup size='md'>
          <Modal.Header/>
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
              <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this Comment?</h3>
              <div className="flex justify-center gap-4">
                <Button color='failure' onClick={handleDeleteComment}>
                  Yes I am sure
                </Button>
                <Button color='gray' onClick={()=>setShowModal(false)}>
                  No,cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
          </Modal>
          {/* tost code */}
          {
            showToast&&(
              <Toast className='fixed top-0 right-0'>
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-300 text-red-500 dark:bg-red-800 dark:text-red-200">
                <HiX className="h-5 w-5" />
              </div>
              <div className="ml-3 text-sm font-normal">Comment has been deleted.</div>
              <Toast.Toggle onDismiss={()=>setShowToast(false)} />
            </Toast>
            )
          }
    </div>
  );
}
