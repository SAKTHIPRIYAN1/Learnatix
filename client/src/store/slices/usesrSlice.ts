// this is the USer slice...

import { combineSlices, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ClassRoomResponse } from "@/types/classRoom";

interface User{
    name:string | null,
    classRooms:ClassRoomResponse[] 
}

const initialState:User={
    name:null,
    classRooms:[]
}

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers: {

    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },

    // setting ClassRooms to the userSlice
    setClassRooms: (state, action: PayloadAction<ClassRoomResponse[]>) => {
      state.classRooms = action.payload;
    },

    // adding a ClassRoom to the userSlice
    addClassRoom: (state, action: PayloadAction<ClassRoomResponse>) => {
      state.classRooms.push(action.payload);
      console.log(action.payload);
    },

    // DELETE ClassRoom from the userSlice
    delClassRoom: (state, action: PayloadAction<string>) => {
      state.classRooms = state.classRooms.filter(
        (classRoom) => classRoom.roomId !== action.payload
      );
    }
    
  },
});

export const {setName,setClassRooms,delClassRoom,addClassRoom}=userSlice.actions;
export default userSlice.reducer;