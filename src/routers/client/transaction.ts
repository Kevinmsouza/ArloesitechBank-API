import { Router } from "express";

import * as controller from "@/controllers/client/transaction";

import schemaValidatingMiddleware from "@/middlewares/schemaValidatingMiddleware";

import transactionSchema from "@/schemas/transactionSchema";
import authenticationMiddleware from "@/middlewares/tokenValidationMiddleware";

const router = Router();

router.post("/deposit", schemaValidatingMiddleware(transactionSchema), controller.deposit);
router.use(authenticationMiddleware);
router.post("/withdraw", schemaValidatingMiddleware(transactionSchema), controller.withdraw);
router.post("/transfer/:userAccountId", schemaValidatingMiddleware(transactionSchema), controller.transfer);

export default router;
