import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import User from "../models/User.ts";

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "",
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const existingUser = await User.findOne({ email: profile.emails?.[0].value });

        if (existingUser) {
            if (!existingUser.googleId) {
                existingUser.googleId = profile.id;
            }
            if (!existingUser.avatarURL) {
                existingUser.avatarURL = profile.photos?.[0].value;
            }
            await existingUser.save();
            return done(null, existingUser);
        }

        const newUser = await User.create({
            email: profile.emails?.[0].value,
            displayName: profile.displayName,
            avatarURL: profile.photos?.[0].value,
            provider: "google",
            googleId: profile.id,
        });

        return done(null, newUser);
    } catch (error) {
        console.error("Google Auth Error:", error);
        return done(error, undefined);
    }
}));

passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID || "",
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
    callbackURL: process.env.LINKEDIN_CALLBACK_URL || "",
    scope: ['openid', 'profile', 'email'], 
    state: false,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value || profile.email; 
        const avatar = profile.photos?.[0]?.value || profile.picture;
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            if (!existingUser.linkedinId) {
                existingUser.linkedinId = profile.id;
            }
            if (!existingUser.avatarURL) {
                existingUser.avatarURL = avatar;
            }
            await existingUser.save();
            return done(null, existingUser);
        }

        const newUser = await User.create({
            email: email,
            displayName: profile.displayName,
            avatarURL: avatar,
            provider: "linkedin",
            linkedinId: profile.id,
        });

        return done(null, newUser);
    } catch (error) {
        console.error("LinkedIn Auth Error:", error);
        return done(error, undefined);
    }
}));