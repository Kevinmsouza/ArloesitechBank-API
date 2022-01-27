export default class CannotDeleteAccount extends Error {
  constructor(balance: number) {
    super(`Cannot delete account with non-null balance! Withdraw the amount of ${balance} and try again.`);

    this.name = "CannotDeleteAccount";
  }
}
