import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const nameWithoutExt = file.originalname.split(".").slice(0, -1).join(".");
        const ext = file.originalname.split(".").pop();
        return {
            folder: "ac2-uploads",
            resource_type: "auto",
            public_id: `${Date.now()}-${nameWithoutExt}`,
            format: ext,
        };
    },
});

export const uploadCloudinary = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        cb(null, true);
    },
});
