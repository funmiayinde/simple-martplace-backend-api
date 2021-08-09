import {Router} from 'express';
import UserController from './user.controller';
import {User} from './user.model';
import auth from '../../../middleware/auth';
import response from '../../../middleware/response';
import UploadFile from '../../../utils/upload-file';

const router = Router();

const userCtrl = new UserController(User);

router.route('/users/current')
	.get(auth, userCtrl.currentUser, response);

router.route('/users')
	.get(auth, userCtrl.find, response)
	.post(auth, userCtrl.create, response);

router.param('id', userCtrl.id, response);
router.route('/users/:id').get(auth, userCtrl.findOne, response)

export default router;
