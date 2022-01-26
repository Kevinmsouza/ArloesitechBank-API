import { Request, Response } from "express";
import httpStatus from "http-status";

import * as accountService from "@/services/client/account";
import AccountData from "@/interfaces/account";

export async function saveAccountInfo(req: Request, res: Response) {
  const accountData = req.body as AccountData;
  accountData.userId = req.user.id;
  const account = await accountService.createOrUpdate(accountData);
  res.status(httpStatus.OK).send(account);
}