import AppSchema from "../../../_core/app.model";
import mongoose, {Schema} from 'mongoose';
import ProductProcessor from './product.processor';
import ProductValidation from './product.validation';

const ProductSchema = new AppSchema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['in_stock', 'out_of_stock', 'pending'],
        default: 'in_stock'
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    images: {
        type: Schema.Types.ObjectId,
        ref: 'Media'
    },
    location: {
        type: {
          type: String,
          default: 'Point'
        },
        coordinates: [Number]
    },
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

ProductSchema.index({'location.coordinates': '2dsphere'});

/**
 * @return {Object} The validator object with specified rules
 * */
ProductSchema.statics.fillables = [
    'name',
    'description',
    'price',
    'status',
    'location',
    'comment',
    'user',
    'images',
    'slug'
];

/**
 * @return {Object} The validator object with specified rules
 * */
ProductSchema.statics.hiddenFields = ['deleted'];

/**
 * @return {Object} The validator object with specified rules
 * */
ProductSchema.statics.softDelete = false;

/**
 * @return {Object} The validator object with specified rules
 * */
ProductSchema.statics.overrideExisiting = true;

/**
 * @return {Object} The validator object with specified rules
 * */
ProductSchema.statics.slugify = 'name';

/**
 * @return {Object} The validator object with specified rules
 * */
ProductSchema.statics.getValidator = () => {
    return new ProductValidation();
};

/**
 * @param {Model} model required for response
 * @return {Object} The processor class instance object
 * */
ProductSchema.statics.getProcessor = (model) => {
    return new ProductProcessor(model);
};

/**
 * @type ProductSchema
 * */
export const ProductModel = mongoose.model('Product', ProductSchema);
