import express from "express";
import * as CCAVController from "../controllers/CCAV/index.ccav.controller";

const router = express.Router();

router.post("/:type", CCAVController.handleCCAVResponse);

export default router;
