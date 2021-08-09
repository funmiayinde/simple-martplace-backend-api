import crypto from 'crypto';
import config from 'config';


/**
 * The AuthEmail class
 * */
const AuthEmail = {

    /**
     * @param {Object} obj The object to perform validation on
     * @return {Object} The template object fot send grid.
     */
    welcomeEmail(obj) {
        const verify_token = crypto.createHash('md5').update(obj.verification_code).digest('hex');
        const link = `${obj.verify_redirect_url}/${obj.email}/${verify_token}`;
        return {
            templateId: config.get('emailAlerts.templateIds.verify'),
            recipients: [obj.email],
            substitutions: {
                first_name: obj.first_name,
                last_name: obj.last_name,
                email: obj.email,
                app_name: config.get('app.appName'),
                subject: `${config.get('app.appName')} - Welcome Message`,
                verify_redirect_url: `${link}`,
                verification_code: `${obj.verification_code}`
            },
        }
    }
};

export default AuthEmail;
