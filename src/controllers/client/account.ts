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

export async function listAccountsOfUser(req: Request, res: Response) {
  const accounts = await accountService.listAccountsByUserId(req.user.id);
  res.status(httpStatus.OK).send(accounts);
}

export async function deleteAccount(req: Request, res: Response) {
  const accountData = {
    id: +req.params.accountId,
    userId: req.user.id
  } as AccountData;
  await accountService.deleteAccount(accountData);
  res.sendStatus(httpStatus.OK);
}

export async function getAccountById(req: Request, res: Response) {
  const accountData = {
    id: +req.params.accountId,
    userId: req.user.id
  } as AccountData;
  const account = await accountService.getAccountById(accountData);
  res.status(httpStatus.OK).send(account);
}
