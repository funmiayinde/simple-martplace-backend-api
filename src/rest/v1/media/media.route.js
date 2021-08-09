import {Router} from 'express';
import MediaController from './media.controller';
import UploadFile from '../../../utils/upload-file';
import {Media} from "./media.model";
import auth from "../../../middleware/auth";
import response from "../../../middleware/response";

const router = Router();
const mediaCtrl = new MediaController(Media);
router.post('/media', new UploadFile({
    type: 'file',
    folder: 'file'
}).init(), auth, mediaCtrl.upload, response);

export default router;
