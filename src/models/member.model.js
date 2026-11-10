import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    login: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        required: true,
        enum: ['member', 'planner'],
    },
}, {
    toJSON: {
        transform(doc, result) {
            result.id = result._id.toString();
            delete result._id;
            delete result.__v;
            delete result.passwordHash;
            return result;
        },
    },
});

export default mongoose.model('Member', memberSchema);
