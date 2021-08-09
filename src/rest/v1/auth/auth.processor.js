import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import axios from 'axios';
import lang from '../../../lang';
import config from 'config';
import AppResponse from '../../../utils/app-response';
import _ from 'lodash';
import EmailService from '../../../utils/email-service';
import {addHourToDate, generateOTCode} from "../../../utils/helper";
import AppError from "../../../utils/app-error";
import {CONFLICT, FORBIDDEN, NOT_FOUND, UNAUTHORIZED} from "../../../utils/codes";


const AuthProcessor = {

    /**
     * @param {Object} obj The object properties
     * @return {Promise<Object>}
     */
    async processNewObject(obj) {
        obj.verification_code_expiration = addHourToDate(1);
        const code = generateOTCode(4);
        if (obj.profile_type === 'App') {
            obj.is_admin = true;
        }
        obj = await _.extend(obj, {verification_code: code});
        return obj;
    },

    /**
     * @param {Object} auth required for response
     * @return {Promise<Object>}
     */
    async signToken(auth) {
        const { _id} = auth;
        return jwt.sign({authId: _id,}, config.get('app.encryption_key'), {expiresIn: config.get('app.auth.expiresIn')});
    },
    /**
     * @param {Object} user The user property
     * @param {Object} object The object properties
     * @return {Object} returns the user error if user cannot be verified
     */
    iCanLogin(user, object) {
        if (!user) {
            return new AppError(lang.get('auth').AUTH102, NOT_FOUND);
        }
        let authenticated = object.password && user.password && user.comparePassword(object.password);
        if (!authenticated) {
            return new AppError(lang.get('auth').AUTH103, UNAUTHORIZED);
        }
        return true;
    },

};

export default AuthProcessor;
