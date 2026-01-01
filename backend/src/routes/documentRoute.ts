import express from "express";
import { 
    createDocument, 
    deleteDocument, 
    getAllDocuments, 
    getDocumentById, 
    updateDocument 
} from "../controllers/documentController.ts";
import { checkAdmin, checkOwnerOrAdmin, protectedRoute } from "../middlewares/authMiddleware.ts";
import { uploadCloudinary } from "../libs/uploadCloudinary.ts";

const router = express.Router();

router.get('/', getAllDocuments);
router.get('/:id', protectedRoute, getDocumentById);

router.post('/', 
    protectedRoute, 
    checkAdmin,
    uploadCloudinary.fields([
        { name: 'thumbnail', maxCount: 1 }, 
        { name: 'document', maxCount: 1 }
    ]), 
    createDocument
);
router.put('/:id', 
    protectedRoute, 
    checkOwnerOrAdmin("document"),
    uploadCloudinary.fields([ 
        { name: 'thumbnail', maxCount: 1 },
        { name: 'document', maxCount: 1 }
    ]), 
    updateDocument
);
router.delete('/:id', protectedRoute, checkOwnerOrAdmin("document"), deleteDocument);

export default router;
