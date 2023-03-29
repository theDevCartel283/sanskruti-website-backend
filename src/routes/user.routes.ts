import express from 'express';
import * as userController from '../contorllers/user.controller';
import validateResources from '../middleware/validateResources';
import { blankSchema } from '../schema/blank.schema';
import { userNamePwd, userObject } from '../schema/user.schema';

const router = express.Router();

router.post(
  '/register',
  validateResources(blankSchema, userObject, blankSchema),
  userController.handleRegister
);
router.post(
  '/login',
  validateResources(blankSchema, userNamePwd, blankSchema),
  userController.handleAuthentication
);

export default router;
