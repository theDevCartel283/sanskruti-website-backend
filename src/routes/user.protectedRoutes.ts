import { blankSchema } from './../schema/blank.schema';
import express from 'express';
import * as userController from '../controllers/user/index.user.controller';
import * as reviewController from '../controllers/product_review/index.review.controller';
import * as wishlistController from '../controllers/wishlist/index.wishlist.controller';
import validateResources from '../middleware/validateResources';
import {
  userDetails,
  userEmailPwd,
  userUpdatePassword,
} from '../schema/user.schema';
import { reviewObject } from '../schema/review.schema';
import { wishlistDetails } from '../schema/wishlist.schema';

const router = express.Router();

router.get('/', userController.handleGetUser);
router.put('/updateWishlist',validateResources(blankSchema,wishlistDetails,blankSchema),wishlistController.addToWishlist);



router.post(
  '/update',
  validateResources(blankSchema, userDetails, blankSchema),
  userController.handleUpdateUser
);

router.get('/logout', userController.handleLogout);

router.post(
  '/password/update',
  validateResources(blankSchema, userUpdatePassword, blankSchema),
  userController.handleUpdatePassword
);

router.delete(
  '/delete',
  validateResources(blankSchema, userEmailPwd, blankSchema),
  userController.handleDelete
);

router.put('/updateReview',validateResources(blankSchema,reviewObject,blankSchema),reviewController.updateReview);

export default router;
