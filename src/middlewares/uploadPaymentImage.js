import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "payments",
        allowed_formats: ["jpg", "png", "jepg", "webp"],
        public_id: (req, file) => {
            const type = req.params.type || "unknown";
            return `${type}_${Date.now()}`;
        }
    },
});

const uploadPaymentImage = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, //5MB
});

export default uploadPaymentImage;