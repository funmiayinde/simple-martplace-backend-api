import slugify from "slugify";


export default (req, res, next) => {
    req.body.slug = slugify(req.body.item_name);
    return next();
};
