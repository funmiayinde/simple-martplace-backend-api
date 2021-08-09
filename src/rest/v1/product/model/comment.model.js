import mongoose, {Schema} from 'mongoose';
import AppSchema from "../../../../_core/app.model";

const CommentSchema = new AppSchema({
    text: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    replies: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    active: {
        type: Boolean,
        default: true
    },
    deleted: {
        type: Boolean,
        select: false,
        default: false
    }
}, {
    autoCreate: true,
    timestamps: true
});

/**
 * @return {Object} The validator object with specified rules
 * */
CommentSchema.statics.fillables = [
    'text',
    'user',
    'replies',
];

/**
 * @return {Object} The validator object with specified rules
 * */
CommentSchema.statics.hiddenFields = ['deleted'];

/**
 * @type CommentSchema
 * */
export const CommentModel = mongoose.model('Comment', CommentSchema);
