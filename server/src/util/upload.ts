import multer from "multer";

const imageMimetypes = ["image/jpeg", "image/jpg", "image/png"];
const upload = multer({
  storage: multer.diskStorage({
    destination: "./uploads",
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (imageMimetypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

export default upload;
