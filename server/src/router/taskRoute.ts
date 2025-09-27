import { Router } from "express"
import {AddTaskController,GetTasksByClassController,DeleteTaskController} from "../controller/taskController";
import { SubmitTaskController,ReviewSubmissionController,GetSubmissionsByTaskController } from "../controller/taskSubmissionController";
// for the file upload!!
import { upload } from "../middlewares/upload";

const taskRouter = Router();

// here file is the key name from the form-data of that file...
taskRouter.post("/create",upload.single("file"),AddTaskController);

taskRouter.get("/get/:classId/:userId",GetTasksByClassController);
taskRouter.delete("/delete/:taskId/:userId/:classId",DeleteTaskController);



// for task Submission By students routes
taskRouter.post("/submit",upload.single("file"),SubmitTaskController);
taskRouter.post("/submission/review",ReviewSubmissionController);
taskRouter.get("/submissions/:taskId/:userId",GetSubmissionsByTaskController);
export default taskRouter;
