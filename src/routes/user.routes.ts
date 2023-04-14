import express from 'express';
import * as userController from '../controllers/user/index.user.controller';
import * as productController from '../controllers/product/index.product.controller';
import * as color_sizeController from '../controllers/color_size/index.color_size.controller';
import validateResources from '../middleware/validateResources';
import { blankSchema } from '../schema/blank.schema';
import { userEmailPwd, userObject } from '../schema/user.schema';
import * as categoryController from '../controllers/category/index.category.controller';

const router = express.Router();

router.post(
  '/register',
  validateResources(blankSchema, userObject, blankSchema),
  userController.handleRegister
);
router.post(
  '/login',
  validateResources(blankSchema, userEmailPwd, blankSchema),
  userController.handleAuthentication
);
router.get('/categories', categoryController.getCategory);
router.get('/colors',color_sizeController.getColor);
router.get('/sizes',color_sizeController.getSize);



router.get('/getallProducts', productController.getallProducts);
router.get('/product', productController.getproductDetails);

export default router;
