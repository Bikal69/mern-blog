import { Table, TableHead,Spinner, Button, Modal,Toast } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { HiOutlineExclamationCircle,HiX } from 'react-icons/hi';
import {useSelector} from 'react-redux'
import { Link } from 'react-router-dom';

export default function DashPosts() {
  const {currentUser}=useSelector((state)=>state.user);
  const [showToast, setShowToast] = useState(false);
  const [userPosts,setUserPosts]=useState([]);
  const [showMore,setShowMore]=useState(true);
  const  [showMoreLoading,setShowMoreLoading]=useState(false);
  const [showModal,setShowModal]=useState(false);
const [PostIdToDelete,setPostIdToDelete]=useState('')
  useEffect(()=>{
    console.log('render')
const fetchPosts=async()=>{
  try{
    const res=await fetch(`/api/post/getposts?userId=${currentUser._id}`)
    const data=await res.json()
if(res.ok){
  setUserPosts(data.posts)
  if(data.posts.length<9){
    setShowMore(false);
  }
}
  }catch(error){
    console.log(error.message)
  }
}
if(currentUser.isAdmin){
  fetchPosts();
}
  },[currentUser._id]);
  const handleShowMore=async()=>{
    const startIndex=userPosts.length;
    setShowMoreLoading(true)
    try{
const res=await fetch( `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
const data=await res.json();
setShowMoreLoading(false)
if(res.ok){
  setUserPosts((prev)=>[...prev,...data.posts]);
  if(data.posts.length<9){
    setShowMore(false);
  }
}
    }catch(error){
      
    }
  }
  //delete post function
  const handleDeletePost=async()=>{
setShowModal(false);
try{
const res=await fetch(`/api/post/deletepost/${PostIdToDelete}/${currentUser._id}`,{
  method:'DELETE',
});
const data=await res.json();
if(!res.ok){
console.log(data.message)
}else{
  setShowToast(true);
  setUserPosts((prev)=>prev.filter((post)=>post._id!==PostIdToDelete));
}
}catch(error){
  
}
  }
  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin&&userPosts.length>0?(
        <>
        <Table hoverable className='shadow-md'>
          <Table.Head>
          <Table.HeadCell>Date Updated</Table.HeadCell>
          <Table.HeadCell>Post Image</Table.HeadCell>
          <Table.HeadCell>Post Title</Table.HeadCell>
          <Table.HeadCell>Category</Table.HeadCell>
          <Table.HeadCell>Delete</Table.HeadCell>
          <Table.HeadCell><span>Edit</span></Table.HeadCell>
          </Table.Head>
        {userPosts.map((post)=>(
          <Table.Body className='divide-y'>
            <Table.Row className=' bg-white dark:border-gray-700 dark:bg-gray-800'>
              <Table.Cell>
                {new Date(post.updatedAt).toLocaleDateString()}
              </Table.Cell>
              <Table.Cell>
                <Link to={`/post/${post.slug}`}>
                  <img src={post.image} alt={post.title} className='w-20 h-10 object-cover bg-gray-500' />
                </Link>
              </Table.Cell>
              <Table.Cell>
                <Link className='font-medium text-gray-900 dark:text-white' to={`/post/${post.slug}`}>
                {post.title}
                </Link>
              </Table.Cell>
              <Table.Cell>
                {post.category}
              </Table.Cell>
              <Table.Cell>
                <span onClick={()=>{
                    setShowModal(true);
                    setPostIdToDelete(post._id);
                }} className='font-medium text-red-500 cursor-pointer hover:underline'>Delete</span>
              </Table.Cell>
              <Table.Cell className='text-teal-500 hover:underline'><Link to={`/update-post/${post._id}`}>
                <span>Edit</span>
              </Link>
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
      ):(<p>You don't have any posts yet!</p>)}
       <Modal show={showModal} onClose={()=>setShowModal(false)} popup size='md'>
          <Modal.Header/>
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
              <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this post?</h3>
              <div className="flex justify-center gap-4">
                <Button color='failure' onClick={handleDeletePost}>
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
              <div className="ml-3 text-sm font-normal">Post has been deleted.</div>
              <Toast.Toggle onDismiss={()=>setShowToast(false)} />
            </Toast>
            )
          }
    </div>
  );
}
