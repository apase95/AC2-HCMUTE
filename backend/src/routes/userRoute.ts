import express from "express"
import { authMe, changePassword, changePhone, updateUserProfile } from "../controllers/userController.ts";
import { protectedRoute } from "../middlewares/authMiddleware.ts";

const router = express.Router();

router.get('/me', protectedRoute, authMe);
router.put('/update', protectedRoute, updateUserProfile);
router.put('/change-phone', protectedRoute, changePhone);
router.put('/change-password', protectedRoute, changePassword);

export default router;