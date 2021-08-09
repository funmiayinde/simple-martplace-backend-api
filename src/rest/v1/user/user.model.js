import AppSchema from '../../../_core/app.model';
import mongoose, {Schema} from 'mongoose';
import UserProcessor from './user.processor';
import UserValidation from './user.validation';
import config from "config";
import Enum from "enum";
import bcrypt from "bcrypt-nodejs";

/**
 * User Schema
 * */
const UserModel = new AppSchema({
	email: {
		type: String,
		lowercase: true,
		unique: true,
		trim: true
	},
	first_name: {
		type: String,
		trim: true,
	},
	last_name: {
		type: String,
		trim: true,
	},
	password: {
		type: String,
	},
	location: {
		street: String,
		city: String,
		state: String,
		country: {type: String, default: 'NG'},
		postal_code: String,
		coordinates: [Number],
	},
	deleted: {
		type: Boolean,
		default: false,
		select: false,
	},
}, {
	autoCreate: true,
	timestamps: true,
	toJSON: { virtuals: true}
});


UserModel.statics.hiddenFields = ['password', 'deleted'];

UserModel.pre('save', function (next) {
	const user = this;
	if (!user.isModified('password')) return next();
	user.password = bcrypt.hashSync(user.password);
	next();
});

/**
 * @param {String} password The password to compare against
 * @return {Boolean} The result of the comparison
 */
UserModel.methods.comparePassword = function (password) {
	return bcrypt.compareSync(password, this.password);
};

/**
 * @return {Object} The validator object with specified rules
 * */
UserModel.statics.getValidator = () => {
	return new UserValidation();
};

/**
 * @param {Model} model required for response
 * @return {Object} The processor class instance object
 * */
UserModel.statics.getProcessor = (model) => {
	return new UserProcessor(model);
};

/**
 * @typedef UserModel
 */
export const User = mongoose.model('User', UserModel);
