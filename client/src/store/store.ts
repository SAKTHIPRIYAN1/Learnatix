import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice";
import userReducer from "./slices/usesrSlice";
import classRoomReducer from './slices/classRoomSlice';


export const store = configureStore({
  reducer: {
    user:userReducer,
    classroom:classRoomReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types..
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
