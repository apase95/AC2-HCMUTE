import jwt from 'jsonwebtoken'
import User from '../models/User.ts'
import dotenv from 'dotenv';
import Blog from '../models/Blog.ts';
import DocumentSchema from '../models/DocumentSchema.ts';
import Exam from '../models/Exam.ts';

dotenv.config();

export const protectedRoute = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            console.error('No access token provided in Authorization header');
            return res.status(401).json({ message: 'Login to continue.' });
        }
        
        if (!process.env.ACCESS_TOKEN_SECRET) {
            console.error("FATAL ERROR: ACCESS_TOKEN_SECRET is not defined in .env");
            return res.status(500).json({ message: "Server misconfiguration" });
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async(err, decodedUser) => {
            if (err) {
                console.error('Access token invalid or expired', err);
                return res.status(403).json({ message: 'Access token invalid or expired' });
            }
            const user = await User.findById(decodedUser.userId).select('-hashedPassword');
            if (!user) {
                console.error('User not found for the provided access token');
                return res.status(404).json({ message: 'User not found' });
            }
            req.user = user;
            next();
        })
    } catch (error) {
        console.error('Error when authenticating JWT in authMiddleware', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const checkOwnerOrAdmin = (modelType: "blog" | "exam" | "document") => {
    return async (req, res, next) => {
        try {
            const userId = req.user._id;
            const resourcesId = req.params.id;
            const isAdmin = req.user.role === 'admin';
            
            let resource;
            if (modelType === "blog") resource = await Blog.findById(resourcesId);
            else if (modelType === "document") resource = await DocumentSchema.findById(resourcesId);      
            else if (modelType === "exam") resource = await Exam.findById(resourcesId);

            if (!resource) return res.status(403).json({ message: `${modelType} not found` });
            if (isAdmin || resource.author.toString() === userId.toString()) {
                next();
            } else {
                return res.status(403).json({ message: 'Access denied. Not owner or admin.' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

export const checkAdmin = () => {
    return async (req, res, next) => {
        try {
            const isAdmin = req.user.role === 'admin';
            if (isAdmin) {
                next();
            } else {
                return res.status(403).json({ message: 'Access denied. Not an admin.' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};