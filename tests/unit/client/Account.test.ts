import Account from "../../../src/entities/Account";
import Enrollment from "../../../src/entities/Enrollment";
import CannotCreateAccountBeforeEnrollment from "../../../src/errors/CannotCreateAccountBeforeEnrollment";
import NotFoundError from "../../../src/errors/NotFoundError";
import CannotDeleteAccount from "../../../src/errors/CannotDeleteAccount";
import { BaseEntity } from "typeorm";

const sut = Account;

describe("createOrUpdate", () => {
  it("Returns an CannotCreateAccountBeforeEnrollment for no enrollment", async() => {
    jest.spyOn(Enrollment, "getByUserIdWithAddress").mockImplementationOnce(() => null);
    const body = {
      number: "21184-4",
      agency: "5706",
      userId: 1
    };
    const promise = sut.createOrUpdate(body);
    await expect(promise).rejects.toThrowError(CannotCreateAccountBeforeEnrollment);
  });
});

describe("deleteAccount", () => {
  it("Returns an NotFoundError for no account found", async() => {
    jest.spyOn(Account, "findOne").mockImplementationOnce(() => null);
    const body = {
      number: "21184-4",
      agency: "5706",
      userId: 1
    };
    const promise = sut.deleteAccount(body);
    await expect(promise).rejects.toThrowError(NotFoundError);
  });
});

describe("deleteAccount", () => {
  it("Returns an CannotDeleteAccount for no account found", async() => {
    jest.spyOn(Account, "findOne").mockImplementationOnce(() => {
      return { balance: 1 } as unknown as Promise<BaseEntity>;
    } );
    const body = {
      number: "21184-4",
      agency: "5706",
      userId: 1
    };
    const promise = sut.deleteAccount(body);
    await expect(promise).rejects.toThrowError(CannotDeleteAccount);
  });
});
