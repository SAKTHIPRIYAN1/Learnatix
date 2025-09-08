
import { Request,Response } from "express";
import prisma from "../prisma";

interface getParticipantsParams{
    classId:string
    userId:string
}
export const getAllParticipants=async(req:Request<{},{},getParticipantsParams>,res:Response)=>{
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

        const classParticipants=await prisma.classRoomParticipant.findMany({
            where:{
                roomId:classId
            },
            include:{
                user:true
            }
        });

        const teachers= classParticipants.filter((user)=>user.role=="TEACHER");
        const students= classParticipants.filter((user)=>user.role=="STUDENT");

        res.status(200).json({msg:"Part reterived",participants:{teachers,students}});
    }
    catch(err){
        console.log(err);
        res.status(500).json({msg:"Error in reterival"});
    }
}