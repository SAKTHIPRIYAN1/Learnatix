import { Router } from "express";
import createClassRoom,{getAllClassRoom,joinClassRoom,AlterSharing,DeleteClassController, LeaveClassController} from "../controller/classRoomController";

// for the file upload!!
import { upload } from "../middlewares/upload";
const classRouter=Router();

classRouter.post('/create',upload.single("pic"),createClassRoom);
classRouter.post('/getAllClass',getAllClassRoom);
classRouter.post('/join',joinClassRoom);
classRouter.patch('/updateSharing',AlterSharing);
classRouter.delete('/:classId/:userId',DeleteClassController);
classRouter.delete('/leave/:userId/:classId',LeaveClassController);

export default classRouter;

