import express from 'express';
import * as superadminController from '../controllers/superadmin/index.superadmin.controller';
import validateResources from '../middleware/validateResources';
import { blankSchema } from '../schema/blank.schema';
import { Admin } from '../schema/admin.schema';
import { BanEmail } from '../schema/superadmin';

const router = express.Router();

router.post(
  '/newAdmin',
  validateResources(blankSchema, Admin, blankSchema),
  superadminController.handleCreateAdmin
);

router.post(
  '/banUser',
  validateResources(blankSchema, BanEmail, blankSchema),
  superadminController.handleBanUser
);

export default router;
