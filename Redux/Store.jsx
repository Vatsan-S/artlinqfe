import persistReducer from "redux-persist/es/persistReducer";
import serviceSlice from "./Slice/serviceSlice";
import storage from "redux-persist/lib/storage";
import { configureStore } from "@reduxjs/toolkit";
import persistStore from "redux-persist/es/persistStore";

const persistConfig = {
    key:'root',
    storage,
    version:1
}

const persistedReducer = persistReducer(persistConfig, serviceSlice)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware)=>getDefaultMiddleware({serializableCheck:false})
})

export const persistor = persistStore(store)