import { createSlice } from "@reduxjs/toolkit";

const initialState={
    currentUser:null,
    error:null,
    loading:false
}
const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        signInStart:(state)=>{
            state.loading=true;
            state.error=null;
        },
        SignInSuccess:(state,action)=>{
            state.currentUser = action.payload;
state.loading=false;
state.error=null;
        },
        signInFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        },
        updateStart:(state)=>{
            state.loading=true;
            state.error=null;
        },
        updateSuccess:(state,action)=>{
            state.currentUser=action.payload;
            state.loading=false;
            state.error=false;
        },
        updateFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        },
        deleteUserStart:(state)=>{
            state.loading=true;
            state.error=null;
        },
        deleteUserSuccess:(state)=>{
            state.currentUser=null;
            state.loading=false;
            state.error=null;
        },
        deleteUserFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        },
        signOutSuccess:(state)=>{
            state.currentUser=null;
            state.error=null;
            state.loading=false;
        },
        signOutFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload
        }
    }
});
export const {signInStart,signInFailure,SignInSuccess,updateFailure,updateStart,updateSuccess,deleteUserFailure,deleteUserStart,deleteUserSuccess,signOutSuccess,signOutFailure}=userSlice.actions;
export default userSlice.reducer;