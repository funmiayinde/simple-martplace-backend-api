import AppController from '../../../_core/app.controller';
import {NOT_FOUND, OK, BAD_REQUEST} from '../../../utils/codes';
import AppError from '../../../utils/app-error';
import lang from '../../../lang';
import _ from 'lodash';

/**
 * The User Controller
 * */
class UserController extends AppController {
	/**
     * @param {Model} model The default model object
     * for the controller. Will be required to create
     * an instance of the controller¬
     */
	constructor(model) {
		super(model);
		this.currentUser = this.currentUser.bind(this);
	}

	/**
     * @param {Object} req The request object
     * @param {Object} res The response object
     * @param {Function} next The callback to the next program handler
     * @return {void}
     */
	async currentUser(req, res, next) {
		try {
			const user = await this.model.findById(req.authId);
			if (!user) {
				return next(new AppError(lang.get('users').not_found, NOT_FOUND));
			}
			req.response = {
				model: this.model,
				code: OK,
				value: user
			};
			return next();
		} catch (e) {
			return next(e);
		}
	}
}

export default UserController;
