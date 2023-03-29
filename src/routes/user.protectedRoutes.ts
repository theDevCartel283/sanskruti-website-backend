import express from 'express';
import * as userController from '../contorllers/user.controller';

const router = express.Router();

router.get('/', userController.handleGetUser);

router.get('/logout', userController.handleLogout);

export default router;
