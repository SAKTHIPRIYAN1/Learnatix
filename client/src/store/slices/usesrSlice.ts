// this is the USer slice...

import { combineSlices, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User{
    name:string | null,
}

const initialState:User={
    name:null
}

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers: {

    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
  },
});

export const {setName}=userSlice.actions;
export default userSlice.reducer;