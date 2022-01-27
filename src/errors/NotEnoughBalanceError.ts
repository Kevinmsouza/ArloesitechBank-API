export default class NotEnoughBalanceError extends Error {
  constructor(balance: number) {
    super(`Not enough balance to make this transaction! Your current balance is: ${balance}`);

    this.name = "NotEnoughBalanceError";
  }
}
