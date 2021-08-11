import AppController from "../../../_core/app.controller";
import AppError from "../../../utils/app-error";
import lang from "../../../lang";
import {BAD_REQUEST, OK} from "../../../utils/codes";
import {Media} from "../media/media.model";
import _ from 'lodash';
import QueryParser from "../../../utils/query-parser";
import {CommentModel} from "./model/comment.model";
import {User} from "../user/user.model";

/**
 * The Product Controller
 * */
class ProductController extends AppController {
    /**
     * @param {Model} model The default model object
     * for the controller. This will be required to create
     * an instance of the controller
     * */
    constructor(model) {
        super(model);
        this.updateProductImage = this.updateProductImage.bind(this);
        this.addComment = this.addComment.bind(this);
        this.replyComment = this.replyComment.bind(this);
    }

    /**
     * @param {Object} req The request object
     * @param {Object} res The response object
     * @param {callback} next The callback to the next program handler
     * @return {Object} res The response object
     */
    async find(req, res, next) {
        const user = await User.findById(req.user);
        console.log('user:', user);
        // _.extend(req.query, {coordinates: _.get(user.location, 'coordinates', [])} );
        _.extend(req.query, {coordinates: [-2.84719, 12.87589]} );
        super.find(req, res, next);
    }

    /**
     * @param {Object} req The request object
     * @param {Object} res The response object
     * @param {callback} next The callback to the next program handler
     * @return {Object} res The response object
     */
    async updateProductImage(req, res, next) {
        try {
            if (!req.file || _.isEmpty(req.file)) {
                return next(new AppError(lang.get('file').no_file_uploaded, BAD_REQUEST));
            }
            console.log('req file:', req.file);
            const file = req.file;
            const fileUploaded = {
                url: file.location,
                key: file.key,
                mime_type: file.mimetype,
            };
            const productItem = req.object;
            const media = await Media({user: req.user, file: fileUploaded, account: req.accountId});
            await media.save();
            productItem['images'] = media._id;
            const savedProductItem = await productItem.save();
            req.response = {
                message: lang.get('file').file_uploaded,
                model: this.model,
                code: OK,
                value: savedProductItem,
            };
            return next();
        } catch (e) {
            return next(e);
        }
    }


    /**
     * @param {Object} req The request object
     * @param {Object} res The response object
     * @param {callback} next The callback to the next program handler
     * @return {Object} res The response object
     */
    async addComment(req, res, next) {
        const queryParser = new QueryParser(Object.assign({}, req.query));
        const processor = this.model.getProcessor(this.model);
        const obj = await processor.prepareBodyObject(req);
        const validator = await this.model.getValidator().addComment({...obj, ...req.params});
        if (!validator.passed) {
            return next(new AppError(lang.get('error').inputs, BAD_REQUEST, validator.errors));
        }
        try {
            const object = req.object;
            const comment = new CommentModel({..._.omit(obj, ['id'])});
            await comment.save();
            object.comments.addToSet(comment._id);
            await object.save();
            req.response = {
                model: this.model,
                message: 'Comment added successfully',
                code: OK,
                value: object,
                queryParser,
            };
            return next();
        } catch (e) {
            return next(e);
        }
    }

    /**
     * @param {Object} req The request object
     * @param {Object} res The response object
     * @param {callback} next The callback to the next program handler
     * @return {Object} res The response object
     */
    async replyComment(req, res, next) {
        const queryParser = new QueryParser(Object.assign({}, req.query));
        const processor = this.model.getProcessor(this.model);
        const obj = await processor.prepareBodyObject(req);
        const validator = await this.model.getValidator().replyComment({...obj, ...req.params});
        if (!validator.passed) {
            return next(new AppError(lang.get('error').inputs, BAD_REQUEST, validator.errors));
        }
        try {
            const object = req.object;
            const comment = await CommentModel.findById(obj.comment_id);
            const replyComment = new CommentModel({..._.omit(obj, ['id', 'comment_id'])});
            await replyComment.save();
            comment.replies.addToSet(replyComment._id);
            await comment.save();
            req.response = {
                model: this.model,
                message: 'Comment added successfully',
                code: OK,
                value: object,
                queryParser,
            };
            return next();
        } catch (e) {
            return next(e);
        }
    }
}

export default ProductController;
