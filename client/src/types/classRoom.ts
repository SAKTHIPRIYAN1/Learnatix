interface User {
  clerkId: string;
  name: string;
  email: string;
  role: "TEACHER" | "STUDENT";
  createdAt: string | "Date/Now"; // ISO Date string
  updatedAt: string | "Date/Now"; // ISO Date string
}

export interface Participant {
  id: number;
  userId: string;
  roomId: string;
  role: "TEACHER" | "STUDENT";
  user: User;
}

interface InviteTokens {
  token :string;
  isSharing:boolean
}

export interface ClassRoomResponse {
  roomId: string;
  name: string;
  description: string | null;
  pic: string | null;
  teachers: Participant[];
  inviteToken:InviteTokens | {isSharing:false,token:"nothing Happened"} ;
  basePath:string;
}


export  interface ChatMessage{
  message:string,
  senderId:string,
  senderName?:string,
  previousSender?:string;
  classRoomId:string;
  sender?:{name:string,role:"STUDENT" | "TEACHER"}
}


export interface Note {
  notesId: string;
  name:string;
  description: string;
  notesPath: string;
  sender:string
}

export type ClassRoomOptions ="chat" | "people" | "works" | "tasks" | "notes";

