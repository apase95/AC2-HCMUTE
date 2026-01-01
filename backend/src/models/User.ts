import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { 
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    hashedPassword: { 
        type: String,
        required: false
    },
    displayName: { 
        type: String,
        required: true,
        trim: true
    },
    firstName: { 
        type: String, 
        trim: true 
    },
    lastName: { 
        type: String, 
        trim: true 
    },
    phoneNumber: { 
        type: String,
        sparse: true
    },
    education: { 
        type: String, 
        trim: true 
    },
    country: { 
        type: String, 
        trim: true 
    },
    province: { 
        type: String, 
        trim: true 
    },
    avatarURL: { 
        type: String 
    },
    avatarId: { 
        type: String 
    },
    bio: { 
        type: String,
        max_length: 500
    },
    provider: { 
        type: String,
        default: "local" 
    }, 
    googleId: { 
        type: String 
    },
    linkedinId: { 
        type: String 
    },
    role: {
        type: String,
        default: "user"
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
