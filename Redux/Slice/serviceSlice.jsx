import { createSlice } from "@reduxjs/toolkit";

const serviceSlice = createSlice({
    name: "services",
    initialState:{
        serviceData:{}
    },
    reducers:{
        updateServiceData:(state,action)=>{
            state.serviceData = action.payload
        }
    }
})

export const {updateServiceData} = serviceSlice.actions
export default serviceSlice.reducer