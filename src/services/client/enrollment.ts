import EnrollmentData from "@/interfaces/enrollment";
import Enrollment from "@/entities/Enrollment";

export async function createOrUpdate(enrollmentData: EnrollmentData) {
  await Enrollment.createOrUpdate(enrollmentData);  
}

export async function getEnrollmentWithAddress(userId: number) {
  return await Enrollment.getByUserIdWithAddress(userId);
}
