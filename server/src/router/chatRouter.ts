import { Router } from "express"
import { SendMessageController } from "../controller/chatController";
import { getAllChats } from "../controller/chatController";
const chatRouter=Router();

chatRouter.post('/',getAllChats);
chatRouter.post('/sendMessage',SendMessageController);

export default chatRouter;