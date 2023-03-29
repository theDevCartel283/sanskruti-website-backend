import express from 'express';
import * as testController from '../contorllers/test.controller';

const router = express.Router();

router.get('/', testController.Test);

export default router;
