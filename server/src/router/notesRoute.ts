import { Router } from "express"
import { getAllNotes,addNotes,deleteNotes } from "../controller/notesController";

// for the file upload!!
import { upload } from "../middlewares/upload";

const notesRouter=Router();

notesRouter.post('/',getAllNotes);
notesRouter.post('/addNotes',upload.single("file"),addNotes);
notesRouter.delete('/:notesId',deleteNotes);
export default notesRouter;