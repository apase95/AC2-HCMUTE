import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.ts';
import Session from '../models/Session.ts';


const ACCESS_TOKEN_TTL = '30m';
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;


export const signUp = async (req, res) => {
    try {
        const {password, email, firstName, lastName} = req.body;
        if (!password || !email || !firstName || !lastName) {
            return res.status(400).json({ message: 'All fields are required!' });
        }
        const normalizedEmail = email.toLowerCase();
        const duplicateEmail = await User.findOne({ email: normalizedEmail });
        if (duplicateEmail) {
            return res.status(409).json({ message: 'Email already exists!' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            email: normalizedEmail,
            hashedPassword,
            displayName: `${firstName} ${lastName}`
        });

        return res.sendStatus(204);
    } catch (error) {
        console.error('Error during user registration:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const signIn = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required!' });
        }

        const normalizedEmail = email.toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(401).json({ message: 'Email or password incorrect!'});
        }
        if (!user.hashedPassword) {
            return res.status(401).json({ message: 'This account uses Google/LinkedIn login. Please use the social buttons.' });
        }

        const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);
        if (!passwordCorrect) {
            return res.status(401).json({ message: 'Email or password incorrect!'})
        }

        const accessToken = jwt.sign(
            {userId: user._id},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: ACCESS_TOKEN_TTL } 
        );

        const refreshToken = crypto.randomBytes(64).toString('hex');
        await Session.deleteMany({userId: user._id});
        await Session.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL)
        });

        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: REFRESH_TOKEN_TTL
        });
        
        return res.status(200).json({ message: `User ${user.displayName} has been logged in!`, accessToken});
    } catch (error) {
        console.error('Error during user sign-in:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const signOut = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken;
        if (token) {
            await Session.deleteOne({refreshToken: token});
            res.clearCookie("refreshToken");
        }
        return res.sendStatus(204);
    } catch (error) {
        console.error('Error during user sign-out:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};