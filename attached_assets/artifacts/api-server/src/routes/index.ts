import { Router, type IRouter } from "express";
import healthRouter from "./health";
import chatRouter from "./chat";
import botsRouter from "./bots";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(chatRouter);
router.use(botsRouter);
router.use(adminRouter);
router.get("/", (_req, res) => { res.json({ status: "ok", message: "PakBot API is running!" }); });


export default router;
