import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser : JSON.parse(localStorage.getItem("currentUserInLoacalStorage")) || {username : "" ,password : "" , email : ''} ,
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
    }
  }
})

export const { signInStart , signInSuccess , signInFailure } = userSlice.actions ;

export default userSlice.reducer ;