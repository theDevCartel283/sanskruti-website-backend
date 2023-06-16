import multer from "multer";
import path from "path";
import fs from "fs";
const directory = path.join(__dirname, "./uploads/");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${directory}`);
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});

export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and jpeg format allowed !"));
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 50, // 50 MB
  },
});
