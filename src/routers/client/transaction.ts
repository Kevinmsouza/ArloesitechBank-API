import { Router } from "express";

import * as controller from "@/controllers/client/transaction";

import schemaValidatingMiddleware from "@/middlewares/schemaValidatingMiddleware";

import transactionSchema from "@/schemas/transactionSchema";

const router = Router();

router.post("/deposit", schemaValidatingMiddleware(transactionSchema), controller.deposit);

export default router;
