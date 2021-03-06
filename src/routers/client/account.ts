import { Router } from "express";

import * as controller from "@/controllers/client/account";

import schemaValidatingMiddleware from "@/middlewares/schemaValidatingMiddleware";

import accountSchema from "@/schemas/accountSchema";

const router = Router();

router.post("/", schemaValidatingMiddleware(accountSchema), controller.saveAccountInfo);
router.get("/", controller.listAccountsOfUser);
router.delete("/:accountId", controller.deleteAccount);
router.get("/:accountId", controller.getAccountById);

export default router;
