import { blankSchema } from './../schema/blank.schema';
import express from 'express';
import * as userController from '../controllers/user/index.user.controller';
import validateResources from '../middleware/validateResources';
import { userNamePwd, userUpdatePassword } from '../schema/user.schema';

const router = express.Router();

router.get('/', userController.handleGetUser);

router.get('/logout', userController.handleLogout);

router.post(
  '/password/update',
  validateResources(blankSchema, userUpdatePassword, blankSchema),
  userController.handleUpdatePassword
);

router.delete(
  '/delete',
  validateResources(blankSchema, userNamePwd, blankSchema),
  userController.handleDelete
);

export default router;
