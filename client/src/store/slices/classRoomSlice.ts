
import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { ChatMessage } from "@/types/classRoom";
import { ClassRoomOptions } from "@/types/classRoom";
interface initialStateTyp{
    activeTab:ClassRoomOptions;
    chatMessages:ChatMessage[]
}

const initialState: initialStateTyp = {
  activeTab: "chat",
  chatMessages: [
    { senderName:"sakthi", classRoomId:"df79f360-70e8-403e-9177-890c1031b549", message: "Hey, how are you doing?", senderId: "user_31myhYnbFuTvBaa7P0aY7DAXXtc" },
    { senderName:"sakthi", classRoomId:"df79f360-70e8-403e-9177-890c1031b549", message: "I’m good, thanks! What about you?", senderId: "user2" },
    { senderName:"sakthi", classRoomId:"df79f360-70e8-403e-9177-890c1031b549", message: "Pretty busy with the project, but it’s going well.", senderId: "user_31myhYnbFuTvBaa7P0aY7DAXXtc" },
    { senderName:"sakthi", classRoomId:"df79f360-70e8-403e-9177-890c1031b549", message: "That’s nice bjkbdkfbgkdbgbbdjkbgjksdbgjkbdkgbbdjbjkdbgjkdbfkgsdbjjsdkgdjksggjkdfjkbdbjk djkgfjsdk gsd fgh kghfdhjkh  hfdh i want to acheive the nav system (in side page.tsx at top) like drive and windows file system eg: parfolder->subFolder->curFolder when i click it it must navigate to that route , how can i acheive like production ready app use generall route in redux centerailized state or for each pages.tsx maunually set that in next js app routeri want to acheive the nav system (in side page.tsx at top) like drive and windows file system eg: parfolder->subFolder->curFolder when i click it it must navigate to that route , how can i acheive like production ready app use generall route in redux centerailized state or for each pages.tsx maunually set that in next js app routeri want to acheive the nav system (in side page.tsx at top) like drive and windows file system eg: parfolder->subFolder->curFolder when i click it it must navigate to that route , how can i acheive like production ready app use generall route in redux centerailized state or for each pages.tsx maunually set that in next js app router to hear. Need any help?", senderId: "user2" },
    { senderName:"sakthi", classRoomId:"df79f360-70e8-403e-9177-890c1031b549", message: "Maybe later. For now, I’m testing the chat UI.", senderId: "user2" },
    { senderName:"sakthi", classRoomId:"df79f360-70e8-403e-9177-890c1031b549", message: "Alright, ping me if anything comes up.", senderId: "user_31myhYnbFuTvBaa7P0aY7DAXXtc" },
  ],
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
            }
        }
    }
);


export const {setActiveTab,addChatMessage,setClassChats} =ClassRoomSlice.actions;
export default ClassRoomSlice.reducer;