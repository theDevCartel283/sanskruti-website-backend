import express from 'express';
import * as healthCheckController from '../controllers/healthCheck.controller';

const router = express.Router();

router.get('/', healthCheckController.HealthCheck);

export default router;
