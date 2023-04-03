import express from 'express';
import * as productController from '../controllers/product/index.product.controller';
import validateResources from '../middleware/validateResources';
import { blankSchema } from '../schema/blank.schema';
import { ProductObject } from '../schema/product.schema';

const router = express.Router();

router.post(
    '/newProduct', validateResources(blankSchema, ProductObject, blankSchema),
    productController.addProduct
);
router.put(
    '/updateProduct', validateResources(blankSchema, ProductObject, blankSchema),
    productController.updateProduct
);
router.delete('/delete', productController.deleteProduct);

export default router;