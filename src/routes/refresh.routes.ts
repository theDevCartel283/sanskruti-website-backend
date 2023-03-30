import express from 'express';
import * as refreshController from '../contorllers/refresh.controller';

const router = express.Router();

router.get('/', refreshController.handleRefresh);

export default router;