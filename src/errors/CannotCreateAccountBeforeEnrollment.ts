export default class CannotCreateAccountBeforeEnrollment extends Error {
  constructor() {
    super("Cannot create account before enrollment!");

    this.name = "CannotCreateAccountBeforeEnrollment";
  }
}
