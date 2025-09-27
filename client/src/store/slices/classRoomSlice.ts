
import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import {ClassRoomOptions, ChatMessage,Note} from "@/types/classRoom";
import { Task } from "@/types/taskRelatedTypes";
import { act } from "react";


interface initialStateTyp{
    activeTab:ClassRoomOptions;
    chatMessages:ChatMessage[];
    notes:Note[];
    tasks:Task[];
}

const initialState: initialStateTyp = {
  activeTab: "chat",
  chatMessages: [],
  notes:[],
  tasks:[]
};

const ClassRoomSlice = createSlice(
    {   
        name:"classroom",
        initialState:initialState,
        reducers:{
            setActiveTab: (state,action:PayloadAction<ClassRoomOptions>) => {
            state.activeTab=action.payload;
            },
            setClassChats: (state,action:PayloadAction<ChatMessage[]>)=>{
                console.log("at the store");
                console.log(action.payload);
                state.chatMessages=action.payload;
            },
            addChatMessage:(state,action:PayloadAction<ChatMessage>)=>{
                state.chatMessages.push(action.payload);
            },

            // notes reducer functionssss!!!!
            setNotes:(state,action:PayloadAction<Note[]>)=>{
                console.log("Notes at the store",action.payload);
                state.notes=action.payload.reverse();
            },
            addNote:(state,action:PayloadAction<Note>)=>{
                state.notes.unshift(action.payload);
            },
            deleteNote:(state,action:PayloadAction<Note>)=>{
                state.notes=state.notes.filter((n)=>n.notesId!==action.payload.notesId);
            },
            
            // task reducer for task related functions and the operations...
            setTasks:(state,action:PayloadAction<Task[]>)=>{
                console.log("Task at the store",action.payload);
                state.tasks=action.payload.reverse();
            },
            addTask:(state,action:PayloadAction<Task>)=>{
                state.tasks.unshift(action.payload);

            },
            deleteTask:(state,action:PayloadAction<Task>)=>{
                state.tasks=state.tasks.filter((t)=>t.taskId!==action.payload.taskId);
            },

        }
    }
);


export const {setActiveTab,addChatMessage,setClassChats,setNotes,addNote,deleteNote
    ,addTask,deleteTask,setTasks
} =ClassRoomSlice.actions;
export default ClassRoomSlice.reducer;