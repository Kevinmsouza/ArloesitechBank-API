import Enrollment from "../../src/entities/Enrollment";
import EnrollmentData from "../../src/interfaces/enrollment";
import User from "../../src/entities/User";
import { getRepository } from "typeorm";
import Address from "../../src/entities/Address";

export function getValidBody() {
  return {
    name: "Zezinho Da Silva",
    cpf: "424.474.010-43",
    birthday: "20-02-1991",
    phone: "(11) 98765-4321", 
    address: {
      cep: "04648-285",
      street: "Rua Xapanã",
      city: "São Paulo",
      number: "101",
      state: "SP",
      neighborhood: "Jardim Los Angeles",
      addressDetail: null
    }
  } as EnrollmentData;
}

export function getInvalidBody() {
  return {
    name: "Zezinho Da Silva",
    cpf: "",
    birthday: "20-02-1991",
    phone: "(11) 98765-4321", 
    address: {
      cep: "04648-285",
      street: "Rua Xapanã",
      city: "São Paulo",
      number: "101",
      state: "SP",
      neighborhood: "Jardim Los Angeles",
      addressDetail: null
    }
  } as EnrollmentData;
}

export async function createEnrollment(user: User) {
  const enrollmentData = getValidBody();
  enrollmentData.userId = user.id;

  const enrollment = getRepository(Enrollment).create(enrollmentData);
  await getRepository(Enrollment).save(enrollment);
  const address = getRepository(Address).create({
    ...enrollmentData.address,
    enrollmentId: enrollment.id
  });
  await getRepository(Address).save(address);

  return enrollment;
}
