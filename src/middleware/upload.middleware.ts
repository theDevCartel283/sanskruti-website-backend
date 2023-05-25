import multer from "multer";
import path from "path";
const directory = path.join(__dirname, "../../public/uploads/");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${directory}`);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname.replace(/ /g, "_")}`);
  },
});

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 50, // 50 MB
  },
});
