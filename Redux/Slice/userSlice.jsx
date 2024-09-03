import { createSlice } from "@reduxjs/toolkit";


const userSlice = new createSlice({
    name:"User",
    initialState:{
        userInfo:{}
    },
    reducers:{
        setUserInfo:(state,action)=>{
            state.userInfo = action.payload
        }
    }
})

export const {setUserInfo} = userSlice.actions
export default userSlice.reducer