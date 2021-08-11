import AppProcessor from "../../../_core/app.processor";
import _ from "lodash";
import {Media} from "../media/media.model";
import {slugifyText} from '../../../utils/helper';


export default class ProductProcessor extends AppProcessor {
    /**
     * @param {Model} model The default model object
     * for the controller. Will be required to create
     * an instance of the controller
     */
    constructor(model) {
        super(model);
    }

    /**
     * @param {Object} pagination The pagination for object
     * @param {Object} queryParser The query parser

     * @return {Object}
     * */
    async buildModelQueryObject(pagination, queryParser) {
        const filter = {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: queryParser.query['coordinates'],
                },
                key: 'location',
                distanceField: 'distance',
                spherical: true,
            },
        };
        queryParser.query = {..._.omit(queryParser.query, ['coordinates'])};
        const query = [
            {...filter},
            {$match: {...queryParser.query}}
        ];
        console.log('query:', JSON.stringify(query));
        return {
            value: await this.model.aggregate(query).exec(),
            count: await this.model.countDocuments(queryParser.query).exec()
        };
    }

    /**
     * @param {Object} req The request object
     * @return {Promise<Object>}
     */
    async prepareBodyObject(req) {
        let obj = Object.assign({}, req.params, req.query, req.body);
        const file = req.file;
        console.log('file:', file);
        const images = [];
        if (file) {
            if (_.isArray(file)) {
                for (let value of file) {
                    const fileUploaded = {
                        url: value.location,
                        key: value.key,
                        mime_type: value.mime_type
                    };
                    const media = new Media({user: obj.user, file: fileUploaded, account: req.accountId});
                    await media.save();
                    images.push(media._id);
                }
            } else {
                const fileUploaded = {
                    url: file.location,
                    key: file.key,
                    mime_type: file.mimetype
                };
                const media = new Media({user: obj.user, file: fileUploaded, account: req.accountId});
                await media.save();
                images.push(media._id);
            }
            _.extend(obj, {images});
        }
        if (req.authId) {
            const user = req.authId;
            obj = Object.assign(obj, {user, userId: user});
        }
        if (this.model.slugify) {
            const value = this.model.slugify;
            if (req.body[value]) {
                obj = Object.assign(obj, {slug: slugifyText(req.body[value].toLowerCase())});
            }
        }
        const reqBody = JSON.parse(JSON.stringify(req.body));
        if (reqBody && req.method === 'POST') {
            _.extend(obj, {location: {coordinates: reqBody.coordinates.split(',')}});
        }
        return obj;
    }

}
