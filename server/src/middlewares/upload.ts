
import multer from "multer";
import path from "path";
import fs from "fs";

// this is for the multer upload file handling!!!

const uploadDir = path.join(__dirname, "../../uploads");

// ensure uploads dir exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


// storing the file in the local storage!!!..
// adding random math digits to the file og name 
// store it in the folder path~~
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });
