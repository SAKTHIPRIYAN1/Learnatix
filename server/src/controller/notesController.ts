import prisma from "../prisma";
import { Request,Response } from "express";
import { getIO } from "../socket";

interface getNotesParams{
    classId:string
    userId:string
}


export const getAllNotes=async(req:Request<{},{},getNotesParams>,res:Response)=>{
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

        const notes=await prisma.notes.findMany({
            where:{
                classId
            }
        })



        res.status(200).json({msg:"Notes reterived",notes});
    }
    catch(err){
        console.log(err);
        res.status(500).json({msg:"Error in reterival"});
    }
}


interface notes{
    classId:string;
    userId:string;
    description:string;
    name:string
}

export const addNotes =async(req:Request<{},{},notes>,res:Response)=>{
    try{
        const {classId,userId,description,name} = req.body;
        const file =req.file;

        if(!file){
            res.status(400).json({msg:"No File Attached"});
            return;
        }

        if(!classId || !userId){
            res.status(400).json({msg:"No Data Attached"});
            return;
        }

        const userPart=await prisma.classRoomParticipant.findMany({
            where:{
                roomId:classId,
                userId,
                role:"TEACHER"
            }
        });

        if(!userPart){
            res.status(401).json({msg:"Heyy Potter , Not Authorized!!"})
            return;
        }

        const insertedRow=await prisma.notes.create({
            data:{
                classId,
                description,
                notesPath:file.filename,
                name:name
            }
        });

        // send Socket Updates!!!
        const io=getIO();
        io.to(classId).emit("addNote",{ note:insertedRow,classId,senderId:userId });

        res.status(201).json({msg:"Notes Created!",note:insertedRow});
    }
    catch(err){
         console.log(err);
        res.status(500).json({msg:"Error in Adding Notes"});
    }
}


export const deleteNotes=async(req:Request<{notesId:string,classId:string,userId:string}>,res:Response)=>{
    try{
        const {notesId,classId,userId}=req.params;
        if(!notesId || !classId || !userId){
            res.status(500).json({msg:"No NotesId Given"});
            return;
        }

        // check if the user is actually the teacher of that class!!
        const userPart=await prisma.classRoomParticipant.findFirst({
            where:{
                roomId:classId,
                userId,
                role:"TEACHER"
            }
        });

        if(!userPart){
            res.status(401).json({msg:"Heyy Potter, Not Authorized!!"})
            return;
        }

        // delete the notes from the database
        const deletedNotes=await prisma.notes.delete({
            where:{
                notesId,
            }
        });

        console.log(deletedNotes);

        const io=getIO();
        io.to(classId).emit("deleteNote", { 
        noteId: deletedNotes.notesId, 
        classId, 
        senderId: userId 
        });
 
        res.status(200).json({msg:"Notes Deleted"});
    }catch(err){
        console.log(err);
        res.status(500).json({msg:"Error in deletion"});
    }
}