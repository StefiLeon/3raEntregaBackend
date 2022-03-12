import multer from 'multer';
// import multerS3 from 'multer-s3';
// import aws from 'aws-sdk';
// import config from '../config/config.js';
import __dirname from '../__dirname.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "thumbnail") {
            cb (null, __dirname+'/public/images');
        } else if (file.fieldname === "documents") {
            cb (null, 'documents');
        } else {
            cb (null, 'uploads');
        }
    },
    filename: (req, file, cb) => {
        cb (null, Date.now()+file.originalname);
    }
})

const upload = multer({storage:storage});

export default upload;
