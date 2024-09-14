import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser : JSON.parse(localStorage.getItem("currentUserInLoacalStorage")) || null ,
  loading : false ,
  error : null ,
}

const userSlice = createSlice({
  name : "user" ,
  initialState ,
  reducers : {
    signInStart : (state) => {
      state.loading = true ;
      state.error = null ;
    },
    signInSuccess : (state,action) => {
      state.loading = false ;
      state.error = null ;
      state.currentUser = action.payload ;
      localStorage.setItem("currentUserInLoacalStorage",JSON.stringify(action.payload))
    },
    signInFailure : (state,action) =>{
      state.loading = false ;
      state.error =action.payload;
    },
    updateStart : (state) => {
      state.loading = true ;
      state.error = null ;
    },
    updateSuccess : (state,action) => {
      state.loading = false ;
      state.currentUser = action.payload ;
      state.error = null ;
    },
    updateFailue : (state,action) => {
      state.loading = false ;
      state.error = action.payload ;
    },
    deleteUserStart : (state) => {
      state.loading = false ;
      state.error = null ;
    },
    deleteUserSuccess : (state) => {
      state.currentUser = null ; 
      state.error = null ;
      state.loading = false ;
    },
    deleteUserFailure : (state,action) => {
      state.error = action.payload ;
      state.loading = null ;
    }
  }
})

export const { signInStart , signInSuccess , signInFailure , updateStart , updateFailure , updateSuccess , deleteUserSuccess , deleteUserFailure , deleteUserStart } = userSlice.actions ;

export default userSlice.reducer ;