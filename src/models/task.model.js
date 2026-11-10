import mongoose from 'mongoose';
import {isCalendarDate} from '../utils/dates.js'


const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 120,
    },
    date: {
        type: String,
        required: true,
        validate: {
            validator: isCalendarDate,
            message: 'Укажите существующую дату в формате YYYY-MM-DD',
        },
    },
    assigneeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        required: true,
    },
    done: {
        type: Boolean,
        default: false,
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, result) {
            result.id = result._id.toString();
            result.assigneeId = result.assigneeId.toString();
            delete result._id;
            delete result.__v;
            return result;
        },
    },
});

taskSchema.index({ date: 1 });
taskSchema.index({ assigneeId: 1, date: 1 });

export default mongoose.model('Task', taskSchema);
