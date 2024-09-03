import { createSlice } from "@reduxjs/toolkit";

const serviceSlice = createSlice({
    name: "services",
    initialState:{
        allServiceData:{}
    },
    reducers:{
        updateServiceData:(state,action)=>{
            state.allServiceData = action.payload
        }
    }
})

export const {updateServiceData} = serviceSlice.actions
export default serviceSlice.reducer