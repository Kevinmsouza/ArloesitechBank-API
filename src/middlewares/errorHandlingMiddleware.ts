import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

import InvalidEmailError from "@/errors/InvalidEmail";
import InvalidDataError from "@/errors/InvalidData";
import ConflictError from "@/errors/ConflictError";
import UnauthorizedError from "@/errors/Unauthorized";
import NotFoundError from "@/errors/NotFoundError";
import CannotCreateAccountBeforeEnrollment from "@/errors/CannotCreateAccountBeforeEnrollment";
import CannotDeleteAccount from "@/errors/CannotDeleteAccount";
import NotEnoughBalanceError from "@/errors/NotEnoughBalanceError";

/* eslint-disable-next-line */
export default function errorHandlingMiddleware (err: Error, _req: Request, res: Response, _next: NextFunction) {
  
  if (err instanceof InvalidEmailError) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: err.message
    });
  }

  if (err instanceof CannotCreateAccountBeforeEnrollment) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: err.message
    });
  }

  if (err instanceof CannotDeleteAccount) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: err.message
    });
  }

  if (err instanceof NotEnoughBalanceError) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: err.message
    });
  }

  if (err instanceof InvalidDataError) {
    return res.status(httpStatus.UNPROCESSABLE_ENTITY).send({
      message: err.message,
      details: err.details
    });
  }

  if (err instanceof ConflictError) {
    return res.status(httpStatus.CONFLICT).send({
      message: err.message
    });
  }

  if (err instanceof UnauthorizedError) {
    return res.status(httpStatus.UNAUTHORIZED).send({
      message: err.message
    });
  }
  
  if (err instanceof NotFoundError) {
    return res.status(httpStatus.NOT_FOUND).send({
      message: err.message
    });
  }

  /* eslint-disable-next-line no-console */
  console.error(err);
  res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    message: "Internal Server Error!"
  });
}
