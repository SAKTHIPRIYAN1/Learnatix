/* ------------------------ Types ------------------------ */
export type Role = "TEACHER" | "STUDENT" | string;

export type Submission = {
  id: string;
  studentId: string;
  studentName?: string;
  student?:{name:string};
  text?: string;
  filePath: string;
  createdAt: string;
  score?: number | null;
  review?: string | null;
  remark?:string |null;
};

export type Task = {
  taskId: string;
  classId: string;
  name: string;
  description?: string;
  type?: "assignment" | "quiz" | string;
  dueDate?: string | null;
  filePath?: string | null;
  createdBy: { id: string; name?: string };
  createdAt: string;
  submission?: Submission[];
};