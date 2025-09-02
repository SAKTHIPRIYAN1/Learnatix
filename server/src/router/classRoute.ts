import { Router } from "express";
import createClassRoom,{getAllClassRoom,joinClassRoom,AlterSharing} from "../controller/classRoomController";

// for the file upload!!
import { upload } from "../middlewares/upload";
const classRouter=Router();

classRouter.post('/create',upload.single("pic"),createClassRoom);
classRouter.post('/getAllClass',getAllClassRoom);
classRouter.post('/join',joinClassRoom);
classRouter.patch('/updateSharing',AlterSharing);

export default classRouter;

