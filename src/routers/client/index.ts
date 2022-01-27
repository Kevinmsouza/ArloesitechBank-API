import { Router } from "express";

import userRouter from "@/routers/client/user";
import authRouter from "@/routers/client/auth";
import enrollmentRouter from "@/routers/client/enrollment";
import accountRouter from "@/routers/client/account";
import transactionRouter from "@/routers/client/transaction";

import tokenValidationMiddleware from "@/middlewares/tokenValidationMiddleware";

const router = Router();

router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/enrollments", tokenValidationMiddleware, enrollmentRouter);
router.use("/accounts", tokenValidationMiddleware, accountRouter);
router.use("/transactions", transactionRouter);

export default router;
