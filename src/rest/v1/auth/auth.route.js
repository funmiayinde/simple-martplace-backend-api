import {Router} from 'express';
import response from '../../../middleware/response';
import AuthController from './auth.controller';


const router = Router();
const authCtrl = new AuthController();

router.route('/login').post(authCtrl.signIn, response);
router.route('/sign-up').post(authCtrl.signUp, response);

export default router;
