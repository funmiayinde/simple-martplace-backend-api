import jwt from 'jsonwebtoken';
import config from 'config';
import lang from "../lang";
import {UNAUTHORIZED} from "../utils/codes";
import AppError from "../utils/app-error";
import {User} from "../rest/v1/user/user.model";

export default (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.get('app.encryption_key'), async (err, decoded) => {
            if (err) {
                let message = '';
                if (err.name) {
                    switch (err.name) {
                        case 'TokenExpiredError':
                            message = 'You are not logged in!';
                            break;
                        default:
                            message = 'Failed to authenticate token';
                            break;
                    }
                }
                const appError = new AppError(message, UNAUTHORIZED, null);
                return next(appError);
            } else {
                req.authId = decoded.authId;
                req.userId = decoded.authId;
                req.user = decoded.authId;
                req.auth = await User.findById(decoded.authId);
                console.log('req authId :::::', req.authId);
                next();
            }
        });
    } else {
        const appError = new AppError(lang.get('auth').AUTH100, UNAUTHORIZED);
        return next(appError);
    }
};
