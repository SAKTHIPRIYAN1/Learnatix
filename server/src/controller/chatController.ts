
import { Request,Response,RequestHandler } from "express";
import prisma from "../prisma";
import { getIO } from "../socket";

interface classParams{
    classId:string
    userId:string
}

export const getAllChats=async(req:Request<{},{},classParams>,res:Response)=>{
    try{
        const {classId,userId} =req.body;

        // check the user is actually the particiapnts in that class!!..
        const userPart=await prisma.classRoomParticipant.findMany({
            where:{
                roomId:classId,
                userId:userId
            }
        });

        if(!userPart){
            res.status(401).json({msg:"Heyy Potter , Not Authorized!!"})
            return;
        }

        const ChatMessages =await prisma.chat.findMany({
            where:{classId},
            include:{
                sender:true
            }
        })
        res.status(200).json({msg:"Chats reterived",chats:ChatMessages});
    }
    catch(err){
        console.log(err);
        res.status(500).json({msg:"Error in reterival"});
    }
}


interface chatMessage{
    message:string,
    senderId:string,
    senderName:string,
    classRoomId:string,
    role:"TEACHER" | "STUDENT"
}
export const SendMessageController:RequestHandler = async(req:Request<{},{},chatMessage>,res:Response)=>{
    try{
        const {message,senderId,senderName,classRoomId,role}=req.body;

        
        console.log(req.body);
        if(senderName=='Unknown'){
            res.status(401).json({msg:"No useName"});
            return;
        }

        // putting the Chat in the DataBase!!!
        const insertedChat=await prisma.chat.create({
            data:{
                message:message,
                senderId:senderId,
                classId:classRoomId,
            }
        });

        // transmitting to the socket to classRoom...
        const io = getIO();
        io.to(classRoomId).emit('newMessage',{ chatId:insertedChat.chatId,senderId,senderName,message,classRoomId,sender:{role} });
        // console.log(insertedChat);
        res.status(200).json({msg:"Message Sent",chat:{chatId:insertedChat.chatId,senderId,senderName,message,classRoomId,sender:{role}}});
        return;
    }
    catch(err){
        console.log(err);
        res.status(500).json({msg:"Error Occured!"});
        return;
    }
}