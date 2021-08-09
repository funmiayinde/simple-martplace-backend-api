import config from 'config';
import apiAuth from './middleware/api';
import errorHandler from './middleware/errors';
import Q from 'q';
import {NOT_FOUND} from "./utils/codes";
import AppError from './utils/app-error';
import auth from './rest/v1/auth/auth.route';
import user from './rest/v1/user/user.route';
import product from './rest/v1/product/product.route';

const prefix = config.get('api.prefix');

/**
 * The routes will add all the application defined routes
 * @param {app} app The app is an instance of an express application
 * @return {Promise<void>}
 */
export default async (app) => {
    app.use(prefix, apiAuth);
    app.use(prefix, auth);
    app.use(prefix, user);
    app.use(prefix, product);

    app.use((req, res, next) => {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
    app.use('*', (req, res, next) => {
        return next(new AppError('not found', NOT_FOUND));
    });
    app.use(errorHandler);
    return Q.resolve(app);
};
