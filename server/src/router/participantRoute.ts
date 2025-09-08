import { Router } from "express"
import { getAllParticipants } from "../controller/participantsController";

const participantRouter=Router();

participantRouter.post('/',getAllParticipants);


export default participantRouter;
;