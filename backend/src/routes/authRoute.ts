import express from "express";
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { signUp } from "../controllers/authController.ts";
import { signIn } from "../controllers/authController.ts";
import { signOut } from "../controllers/authController.ts";

const router = express.Router();

const generateToken = (id: string) => {
    return jwt.sign(
        { userId: id }, 
        process.env.ACCESS_TOKEN_SECRET || "secret",
        { expiresIn: '30d' }
    );
}

router.get("/google", passport.authenticate("google", { 
    scope: ["profile", "email"],
    session: false
}));
router.get("/google/callback", 
    passport.authenticate("google", {
        session: false, 
        failureRedirect: `${process.env.CLIENT_URL}/login` 
    }),(req: any, res) => {
        const token = generateToken(req.user._id);
        res.redirect(`${process.env.CLIENT_URL}/login?accessToken=${token}`);
    }
);

router.get("/linkedin", passport.authenticate("linkedin", { 
    scope: ["openid", "profile", "email"], 
    session: false
}));
router.get("/linkedin/callback", 
    passport.authenticate("linkedin", {
        session: false, 
        failureRedirect: `${process.env.CLIENT_URL}/login` 
    }),(req: any, res) => {
        const token = generateToken(req.user._id);
        res.redirect(`${process.env.CLIENT_URL}/login?accessToken=${token}`);
    }
);

router.post('/register', signUp);
router.post('/signin', signIn);
router.post('/signout', signOut);

export default router;