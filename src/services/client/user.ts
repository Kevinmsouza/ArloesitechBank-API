import User from "@/entities/User";

export async function createNewUser(email: string, password: string) {
  const user = await User.createNew(email, password);
  return user;
}
