const formidable = require('formidable');
const { responseReturn } = require('../../utiles/response');
const cloudinary = require('cloudinary').v2;
const categoryModel = require('../../models/categoryModel');

class categoryController {
  add_category = async (req, res) => {
    const form = new formidable.Formidable();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        responseReturn(res, 404, { error: 'Something went wrong' });
      } else {
        let { name } = fields;
        let { image } = files;
        name = name?.trim();

        const slug = name.split(' ').join('-');
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        try {
          const result = await cloudinary.uploader.upload(image.filepath, {
            folder: 'categorys',
          });
          if (result) {
            const category = await categoryModel.create({
              name,
              slug,
              image: result.url,
            });
            responseReturn(res, 201, {
              category,
              message: 'Category Added Successfully',
            });
          } else {
            responseReturn(res, 404, { error: 'Image Upload Failed' });
          }
        } catch (error) {
          responseReturn(res, 500, { error: 'Internal Server Error' });
        }
      }
    });
  };
  get_category = async (req, res) => {
    const { page, searchValue, parPage } = req.query;

    try {
      let skipPage = '';
      if (parPage && page) {
        skipPage = parseInt(parPage) * (parseInt(page) - 1);
      }

      if (searchValue && page && parPage) {
        const categorys = await categoryModel
          .find({
            $text: { $search: searchValue },
          })
          .skip(skipPage)
          .limit(parPage)
          .sort({ createdAt: -1 });
        const totalCategory = await categoryModel
          .find({
            $text: { $search: searchValue },
          })
          .countDocuments();
        responseReturn(res, 200, { categorys, totalCategory });
      } else if (searchValue === '' && page && parPage) {
        const categorys = await categoryModel
          .find({})
          .skip(skipPage)
          .limit(parPage)
          .sort({ createdAt: -1 });
        const totalCategory = await categoryModel.find({}).countDocuments();
        responseReturn(res, 200, { categorys, totalCategory });
      } else {
        const categorys = await categoryModel.find({}).sort({ createdAt: -1 });
        const totalCategory = await categoryModel.find({}).countDocuments();
        responseReturn(res, 200, { categorys, totalCategory });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
}

module.exports = new categoryController();
