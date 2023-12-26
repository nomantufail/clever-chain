import multer from "multer";
const storage = multer.diskStorage({
    // @ts-ignore
    destination: function (req, file, cb) {
        cb(null, "./../batch-engine/uploads")
    },
    // @ts-ignore
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname)
    },
})

const upload = multer({
    storage: storage,
})

export default upload;
