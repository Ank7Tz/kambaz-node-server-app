import { v4 as uuidv4 } from "uuid";
import { DB, Enrollment, User } from "../Database/index";

export default function EnrollmentsDao(db: DB) {
    const enrollUserInCourse = (userId: string, courseId: string) => {
        const { enrollments } = db;
        if (enrollments.find((e: Enrollment) => e.user === userId && e.course === courseId)) {
            return;
        }
        enrollments.push({ _id: uuidv4(), user: userId, course: courseId });
    }

    const unrollUserFromCourse = (userId: string, courseId: string) => {
        const { enrollments } = db;
        db.enrollments = enrollments.filter((e: Enrollment) => !(e.user === userId && e.course === courseId))
    }
    const allPeopleFromCourse = (courseId: string): User[] => {
        return db.users.filter((u: User) => db.enrollments.some((e: Enrollment) => e.course === courseId && e.user === u._id));
    }

    return { enrollUserInCourse, unrollUserFromCourse, allPeopleFromCourse };
}