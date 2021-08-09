import config from 'config';
import Validator from 'validatorjs';

/**
 * The Auth Validation class
 * */
const AuthValidation = {
    /**
     * @param {Object} body The object to validate
     * @return {Object} Validator
     * */
    async signIn(body = {}) {
        const rules = {
            email: 'required|email',
            password: 'required|min:6'
        };
        const validator = new Validator(body, rules);
        return {
            errors: validator.errors.all(),
            passed: validator.passes()
        }
    },

    /**
     * @param {Object} body The object to validate
     * @return {Object} Validator
     * */
    async signUp(body = {}) {
        const rules = {
            first_name: 'required',
            last_name: 'required',
            email: 'required|email',
            password: 'required|min:6',
            location: 'required',
            'location.street': 'required',
            'location.city': 'required',
            'location.coordinates': 'required|array',
        };
        const validator = new Validator(body, rules);
        return {
            errors: validator.errors.all(),
            passed: validator.passes()
        }
    },
};

export default AuthValidation;
