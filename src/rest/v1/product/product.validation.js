import AppValidation from "../../../_core/app.validation";
import Validator from 'validatorjs';

/**
 * The Category Validation
 * */
export default class ProductValidation extends AppValidation {

    async create(body) {
        const rules = {
            name: 'required',
            price: 'required',
            images: 'required',
            coordinates: 'required',
        };
        const validator = new Validator(body, rules);
        return {
            errors: validator.errors.all(),
            passed: validator.passes()
        }
    }

    async addComment(body) {
        const rules = {
            id: 'required',
            text: 'required',
            user: 'required',
        };
        const validator = new Validator(body, rules);
        return {
            errors: validator.errors.all(),
            passed: validator.passes()
        }
    }
    async replyComment(body) {
        const rules = {
            id: 'required',
            comment_id: 'required',
            text: 'required',
            user: 'required',
        };
        const validator = new Validator(body, rules);
        return {
            errors: validator.errors.all(),
            passed: validator.passes()
        }
    }

    async update(body) {
        const rules = {};
        const validator = new Validator(body, rules);
        return {
            errors: validator.errors.all(),
            passed: validator.passes()
        };
    }
}
