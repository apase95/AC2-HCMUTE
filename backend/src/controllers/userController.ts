import User from "../models/User.ts";
import bcrypt from 'bcrypt';

export const authMe = async(req, res) => {
    try {
        const userId = req.user?._id || req.userId;
        const user = await User.findById(userId).select('-hashedPassword');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error('Error during authMe:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { 
            firstName, 
            lastName, 
            phoneNumber, 
            education, 
            country, 
            province 
        } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.education = education || user.education;
        user.country = country || user.country;
        user.province = province || user.province;

        if (firstName && lastName) {
            user.displayName = `${firstName} ${lastName}`;
        }
        await user.save();

        const updatedUser = user.toObject();
        delete updatedUser.hashedPassword;

        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const changePhone = async (req, res) => {
    try {
        const { password, oldPhone, newPhone } = req.body;
        const userId = req.user._id;
        
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        if (!user.hashedPassword) return res.status(400).json({ message: "Social account cannot change number" });

        const isMatch = await bcrypt.compare(password, user.hashedPassword);
        if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

        if (user.phoneNumber) {
            if (!oldPhone || user.phoneNumber !== oldPhone) {
                return res.status(400).json({ message: "Old phone number does not match" });
            }
        }
        user.phoneNumber = newPhone;
        await user.save();        
        res.status(200).json({ message: "Phone number updated" });
    } catch (error) {
        console.error("Error changing phone number:", error);
        res.status(500).json({ message: "Internal error" });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { phone, oldPass, newPass } = req.body;
        const userId = req.user._id;
        
        const user = await User.findById(userId);

        if (user.phoneNumber !== phone) {
             return res.status(400).json({ message: "Phone number verification failed" });
        }

        const isMatch = await bcrypt.compare(oldPass, user.hashedPassword);
        if (!isMatch) return res.status(401).json({ message: "Incorrect old password" });

        const hashedNewPass = await bcrypt.hash(newPass, 10);
        user.hashedPassword = hashedNewPass;
        
        await user.save();
        res.status(200).json({ message: "Password updated" });
    } catch (error) {
        res.status(500).json({ message: "Internal error" });
    }
};