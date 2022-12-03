import multer, { Options, diskStorage } from 'multer';
import path from 'path';

const storageTypes = {
    local: diskStorage({
        destination: (req, file, next) => {
            next(null, path.join(__dirname, '../../uploads'));
        },
        filename: (req, file, next) => {
            next(null, `${Date.now()}-${file.originalname}`);
        },
    }),
};

export const multerOptions = {
    storage: storageTypes.local,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, callback) => {
        const formats = ['image/jpeg', 'image/jpg', 'image/png'];
        const isAcceptedFormat = formats.includes(file.mimetype);

        if (!isAcceptedFormat) {
            return callback(new Error('Invalid format!'));
        }

        return callback(null, true);
    },
} as Options;

export const uploadImage = multer(multerOptions);
