require('dotenv').config();
const PORT = process.env.PORT || 3000;
console.log('port', PORT);
module.exports = {
    app: {
        appName: process.env.APP_NAME || 'simple-martplace',
        environment: process.env.NODE_ENV || 'development',
        api_key: process.env.API_KEY || 'simplemartplace_web',
        superSecret: process.env.SERVER_SECRET || 'Simplemartplace',
        baseUrl: process.env.BASE_URL || `http://localhost:${PORT}`,
        encryption_key: process.env.SERVER_SECRET || 'appSecret',
        email_encryption: process.env.EMAIL_ENCRYPTION || false,
        verify_redirect_url: `${process.env.BASE_URL}/verify`,
        auth: {
            expiresIn: 3600 * 124,
        },
        port: PORT
    },
    services: {
        simplemartplace: process.env.SIMPLEMARTPLACE || 'simple-martplace'
    },
    databases: {
        url: process.env.DB_URL,
        test: process.env.DB_TEST_URL
    },
    api: {
        lang: 'en',
        prefix: '^/api/v[1-9]',
        versions: [1],
        patch_version: '1.0.0',
        pagination: {
            itemsPerPage: 10
        },
    },
    email: {
        sendgrid: {
            apiKey: process.env.SENDGRID_API_KEY,
            from: process.env.EMAIL_NO_REPLY || 'noreply@simplemartplace.com',
            contactFormRecipient: process.env.CONTACT_FORM_EMAIL_RECEIPIENT,
        }
    },
    emailAlerts: {
        templateIds: {
            verify: process.env.VERIFY_CODE,
            reset_password: process.env.RESET_PASSWORD,
        }
    },
    excludedUrls: [
        {route: '', methods: 'GET'},
        {route: 'login', methods: 'POST'},
        {route: 'register', methods: 'POST'},
    ],
    aws: {
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
            region: process.env.AWS_REGION,
            params: {Bucket: 'cas-findfood'}
        },
        bucket: process.env.AWS_BUCKET,
        s3Link: `https://s3-${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_BUCKET}`
    },
    google: {
        credentials: {
            apiKey: process.env.GOOGLE_API_KEY,
            provider: process.env.GOOGLE_AS_PROVIDER,
        }
    }
};
