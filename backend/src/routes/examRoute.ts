import express from 'express';
import { 
    createExam, 
    deleteExam, 
    getAllExams, 
    getExamById, 
    updateExam,
    createExamFromJson,
    addReview,
    submitExamScore
} from '../controllers/examController.ts';
import { checkAdmin, checkOwnerOrAdmin, protectedRoute } from '../middlewares/authMiddleware.ts';
import { uploadCloudinary } from '../libs/uploadCloudinary.ts';

const router = express.Router();

router.get('/', getAllExams);
router.get('/:id', protectedRoute, getExamById);

router.post('/', protectedRoute, checkAdmin, createExam);
router.post('/upload-json', protectedRoute, checkAdmin, createExamFromJson);

router.post('/:id/review', protectedRoute, addReview);
router.post('/:id/score', protectedRoute, submitExamScore);
router.put('/:id', 
    protectedRoute, 
    checkOwnerOrAdmin("exam"), 
    uploadCloudinary.fields([ 
        { name: 'thumbnail', maxCount: 1 },
        { name: 'document', maxCount: 1 }
    ]),
    updateExam
);
router.delete('/:id', protectedRoute, checkOwnerOrAdmin("exam"), deleteExam);

export default router;