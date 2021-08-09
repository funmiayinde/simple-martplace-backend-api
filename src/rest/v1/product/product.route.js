import {Router} from 'express';
import response from '../../../middleware/response';
import {ProductModel} from './product.model';
import auth from '../../../middleware/auth';
import ProductController from './product.controller';
import UploadFile from "../../../utils/upload-file";

const router = Router();
const productCtrl = new ProductController(ProductModel);


router.route('/products/:id/comment').put(auth, productCtrl.addComment, response)
router.route('/products/:id/comment/:comment_id/reply').put(auth, productCtrl.replyComment, response)

router.route('/products')
    .post(auth, new UploadFile({
        type: 'file',
        folder: 'product',
    }).init(), productCtrl.create, response)
    .get(auth, productCtrl.find, response);

router.param('id', productCtrl.id);
router.route('/products/:id').get(productCtrl.findOne, response);

export default router;
