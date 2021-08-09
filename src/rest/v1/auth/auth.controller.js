import {BAD_REQUEST, CONFLICT, OK} from "../../../utils/codes";
import AuthValidation from './auth.validation';
import {User} from '../user/user.model';
import AppError from '../../../utils/app-error';
import lang from '../../../lang';
import AuthProcessor from './auth.processor';

class AuthController {

    constructor() {
        this.signIn = this.signIn.bind(this);
        this.signUp = this.signUp.bind(this);
    }

    /**
     * @param {Object} req The request object
     * @param {Object} res The response object
     * @param {Function} next The callback to the next program handler
     * @return {Object} res The response object
     * */
    async signIn(req, res, next) {
        try {
            const obj = req.body;
            const validator = await AuthValidation.signIn(obj);
            if (!validator.passed) {
                return next(new AppError(lang.get('auth').AUTH101, BAD_REQUEST, validator.errors));
            }
            const user = await User.findOne({email: obj.email.toLowerCase()}).select('+password');
            const iCanLogin = await AuthProcessor.iCanLogin(user, obj);
            if (iCanLogin instanceof AppError) {
                return next(iCanLogin);
            }
            const token = await AuthProcessor.signToken({});
            req.response = {
                token,
                model: User,
                code: OK,
                value: {...user.toJSON(),}
            };
            return next();
        } catch (e) {
            return next(e);
        }
    }

    /**
     * @param {Object} req The request object
     * @param {Object} res The response object
     * @param {Function} next The callback to the next program handler
     * @return {Object} res The response object
     */
    async signUp(req, res, next) {
        try {
            const obj = req.body;
            const validator = await AuthValidation.signUp(obj);
            if (!validator.passed) {
                return next(new AppError(lang.get('auth').AUTH101, BAD_REQUEST, validator.errors));
            }
            let user = await User.findOne({email: obj.email});
            if (user) {
                return next(new AppError(lang.get('auth').AUTH104, CONFLICT));
            }
            user = new User({...obj});
            user = await user.save();
            const token = await AuthProcessor.signToken({...user.toJSON()});
            req.response = {
                token,
                model: User,
                code: OK,
                value: {...user.toJSON(),}
            };
            return next();
        } catch (e) {
            return next(e);
        }
    }

}

export default AuthController;
