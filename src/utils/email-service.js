import config from 'config';
import sgMail from '@sendgrid/mail';
import Validator from 'validatorjs';
import _ from 'lodash';

/**
 * @class
 * */
class EmailService {
	/**
     * @function
     * @return {Object} the sendgrid instance
     * */
	static sendgridConfig() {
		sgMail.setApiKey(`${config.get('email.sendgrid.apiKey')}`);
		sgMail.setSubstitutionWrappers('{{', '}}');
		return sgMail;
	}

	/**
     * @function
     * @param {Object} options the options object
     * @return {function} the email send function
     * */
	static async sendEmail(options) {
		try {
			if (`${config.util.getEnv('NODE_ENV')}` === 'test') {
				return;
			}
			const rules = {
				recipients: 'required',
				templateId: 'required'
			};
			const validator = new Validator(options, rules);
			if (validator.fails()) {
				console.log(validator.errors.all());
				throw new Error('Email options validation error');
			}
			const sgMail = this.sendgridConfig();
			const message = {
				to: options.recipients,
				from: options.from || 'no-reply@simplemartplace.com',
				subject: options.subject || 'Simple Martplace',
				templateId: options.templateId,
			};
			if (options.account) {
				options.substitutions = Object.assign(
					{},
					options.substitutions,
					{
						banner: _.get(options.account, 'banner.url', ''),
						company_name: _.get(options.account, 'basic_information.organisation_name', config.get('app.name')),
						...(_.pick(options.account.basic_information, ['display_name', 'website'])),
					}
				);
			}
			if (options.substitutions) {
				message.dynamic_template_data = Object.assign({}, options.substitutions, {appName: 'simple-martplace'});
				return await sgMail.send(message);
			}
		} catch (e) {
			console.log('email error: ', e);
		}
	}
}

export default EmailService;
