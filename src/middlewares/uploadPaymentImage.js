import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        const type = req.params.type || "payment";

        return {
            folder: "payments",
            resource_type: "image",
            public_id: `${type}_${Date.now()}`,
        };
    },
});

const uploadPaymentImage = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default uploadPaymentImage;