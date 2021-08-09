import AppSchema from "../../../_core/app.model";
import mongoose, {Schema} from 'mongoose';

const MediaModel = new AppSchema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    active: {
        type: Boolean,
        default: true
    },
    file: {
        url: {type: String, required: true},
        key: {type: String, required: true},
        mime_type: {type: String},
    },
    deleted: {
        type: Boolean,
        select: false,
        default: false
    }
}, {
    autoCreate: true,
    timestamps: true,
});


/**
 * @type MediaModel
 * */
export const Media = mongoose.model('Media', MediaModel);
