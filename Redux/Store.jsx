import persistReducer from "redux-persist/es/persistReducer";
import serviceSlice from "./Slice/serviceSlice";
import storage from "redux-persist/lib/storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import persistStore from "redux-persist/es/persistStore";
import userSlice from "./Slice/userSlice";

const rootSlice = combineReducers({
    User : userSlice,
    Service: serviceSlice
})

const persistConfig = {
    key:'root',
    storage,
    version:1
}

const persistedReducer = persistReducer(persistConfig, rootSlice)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware)=>getDefaultMiddleware({serializableCheck:false})
})

export const persistor = persistStore(store)