import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice";
import userReducer from "./slices/usesrSlice";

export const store = configureStore({
  reducer: {
    user:userReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types..
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
