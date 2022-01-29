import { getRepository } from "typeorm";
import bcrypt from "bcrypt";
import User from "../../src/entities/User";

export function getValidBody() {
  return {
    email: "teste@teste.com",
    password: "senhaSuperSecreta"
  };
}

export function getInvalidBody() {
  return {
    email: "teste@teste.com",
    password: ""
  };
}

export async function createUser() {
  const user = getRepository(User).create(getValidBody());

  user.password = bcrypt.hashSync(user.password, 12);
  await getRepository(User).save(user);

  return user;
}
