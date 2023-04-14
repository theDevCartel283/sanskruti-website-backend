import express from 'express';
import * as productController from '../controllers/product/index.product.controller';
import *as categoryController from '../controllers/category/index.category.controller';
import * as color_sizeController from '../controllers/color_size/index.color_size.controller';
import { categoryDetails } from '../schema/category.schema';
import validateResources from '../middleware/validateResources';
import { blankSchema } from '../schema/blank.schema';
import { ProductObject } from '../schema/product.schema';
import { colorDetails } from '../schema/color.schema';
import { sizeDetails } from '../schema/size.schema';

const router = express.Router();


// product 

router.post(
    '/newProduct', validateResources(blankSchema, ProductObject, blankSchema),
    productController.addProduct
);
router.put(
    '/updateProduct', validateResources(blankSchema, ProductObject, blankSchema),
    productController.updateProduct
);
router.delete('/delete', productController.deleteProduct);

// categories 


router.put('/addCategory', validateResources(blankSchema, categoryDetails, blankSchema), categoryController.addCategory);
router.delete('/deleteCategory', categoryController.deleteCategory);

// color 
router.post('/addColor',validateResources(blankSchema,colorDetails,blankSchema),color_sizeController.addColor);
router.put('/updateColor',validateResources(blankSchema,colorDetails,blankSchema),color_sizeController.updateColor);

//size
router.post('/addSize',validateResources(blankSchema,sizeDetails,blankSchema),color_sizeController.addSize);

export default router;