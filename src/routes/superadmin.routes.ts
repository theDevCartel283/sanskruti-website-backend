import express from 'express';
import * as superadminController from '../controllers/superadmin/index.superadmin.controller';
import validateResources from '../middleware/validateResources';
import { blankSchema } from '../schema/blank.schema';
import { Admin } from '../schema/admin.schema';

const router = express.Router();

router.post(
  '/newAdmin',
  validateResources(blankSchema, Admin, blankSchema),
  superadminController.handleCreateAdmin
);

export default router;
