interface User {
  clerkId: string;
  name: string;
  email: string;
  role: "TEACHER" | "STUDENT";
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}

interface Participant {
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
  students: Participant[];
  inviteToken:InviteTokens ;
}

export interface studentClassRoomResponse{
  roomId: string;
  name: string;
  description: string | null;
  pic: string | null;
  teachers: Participant[];
  students: Participant[];
}


