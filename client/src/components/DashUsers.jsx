import { Table, TableHead,Spinner, Button, Modal,Toast } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { HiOutlineExclamationCircle,HiX } from 'react-icons/hi';
import {FaCheck,FaTimes} from 'react-icons/fa';
import {useSelector} from 'react-redux'


export default function DashUsers() {
  const {currentUser}=useSelector((state)=>state.user);
  const [Admin,setAdmin]=useState()
  const [showToast, setShowToast] = useState(false);
  const [Users,setUsers]=useState([]);
  const [showMore,setShowMore]=useState(true);
  const  [showMoreLoading,setShowMoreLoading]=useState(false);
  const [showModal,setShowModal]=useState(false);
const [UserIdToDelete,setUserIdToDelete]=useState('')
  useEffect(()=>{
    console.log('render')
const fetchUsers=async()=>{
  try{
    const res=await fetch(`/api/user/getusers`)
    const data=await res.json()
if(res.ok){
  setUsers(data.users)
  if(data.users.length<5){
    setShowMore(false);
  }
}
  }catch(error){
    console.log(error.message)
  }
}
if(currentUser.isAdmin){
  fetchUsers();
}
  },[currentUser._id]);
  //show more function
  const handleShowMore=async()=>{
    const startIndex=Users.length;
    setShowMoreLoading(true)
    try{
const res=await fetch( `/api/user/getusers?startIndex=${startIndex}`);
const data=await res.json();
setShowMoreLoading(false)
if(res.ok){
  setUsers((prev)=>[...prev,...data.users]);
  if(data.users.length<5){
    setShowMore(false);
  }
}
    }catch(error){
      
    }
  }
  //delete user function
  const handleDeleteUser=async()=>{
setShowModal(false);
try{
const res=await fetch(`/api/user/delete/${UserIdToDelete}`,{
  method:'DELETE',
});
const data=await res.json();
if(!res.ok){
console.log(data.message)
}else{
  setShowToast(true);
  setUsers((prev)=>prev.filter((user)=>user._id!==UserIdToDelete));
}
}catch(error){
  
}
  }
  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin&&Users.length>0?(
        <>
        <Table hoverable className='shadow-md'>
          <Table.Head>
          <Table.HeadCell>Date Updated</Table.HeadCell>
          <Table.HeadCell>User Image</Table.HeadCell>
          <Table.HeadCell>Username</Table.HeadCell>
          <Table.HeadCell>Admin</Table.HeadCell>
          <Table.HeadCell>email</Table.HeadCell>
          <Table.HeadCell>Delete</Table.HeadCell>
          <Table.HeadCell><span>Edit</span></Table.HeadCell>
          </Table.Head>
        {Users.map((user)=>(
          <Table.Body key={user._id} className='divide-y'>
            <Table.Row className=' bg-white dark:border-gray-700 dark:bg-gray-800'>
              <Table.Cell>
                {new Date(user.createdAt).toLocaleDateString()}
              </Table.Cell>
              <Table.Cell>
                  <img src={user.profilePicture} alt={user.username} className='w-10 h-10 object-cover rounded-md bg-gray-500' />
              </Table.Cell>
              <Table.Cell>
                {user.username}
              </Table.Cell>
              <Table.Cell>
                {user.isAdmin?(<FaCheck className='text-green-500'/>):(<FaTimes className='text-red-500'/>)}
              </Table.Cell>
              <Table.Cell>
                {user.email}
              </Table.Cell>
              <Table.Cell>
                <span onClick={()=>{
                    setAdmin(user.isAdmin)
                    setShowModal(true);
                    setUserIdToDelete(user._id);
                }} className='font-medium text-red-500 cursor-pointer hover:underline'>Delete</span>
              </Table.Cell>
              <Table.Cell className='text-teal-500 hover:underline'>
                <span>Edit</span>
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
      ):(<p>You don't have any Users yet!</p>)}
       <Modal show={showModal} onClose={()=>setShowModal(false)} popup size='md'>
          <Modal.Header/>
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
              <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this user?</h3>
              <div className="flex justify-center gap-4">
                <Button color='failure' onClick={handleDeleteUser}>
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
              <div className="ml-3 text-sm font-normal">User has been deleted.</div>
              <Toast.Toggle onDismiss={()=>setShowToast(false)} />
            </Toast>
            )
          }
    </div>
  );
}
