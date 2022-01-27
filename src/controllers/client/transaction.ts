import { Request, Response } from "express";
import httpStatus from "http-status";

import * as transactionService from "@/services/client/transaction";
import TransactionData from "@/interfaces/transaction";

export async function deposit(req: Request, res: Response) {
  const transactionData = req.body as TransactionData;
  const transaction = await transactionService.deposit(transactionData);
  res.status(httpStatus.OK).send(transaction);
}
