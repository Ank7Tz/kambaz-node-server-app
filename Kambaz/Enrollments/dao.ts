import { v4 as uuidv4 } from "uuid";
import { DB, Enrollment, User } from "../Database/index";
import model from "./model";
export default function EnrollmentsDao(db: DB) {

    async function findCoursesForUser(userId: string) {
        const enrollments = await model.find({ user: userId }).populate("course");
        return enrollments.map((enrollment) => enrollment.course);
    }

    const enrollUserInCourse = async (userId: string, courseId: string) => {
        return model.create({
            user: userId,
            course: courseId,
            _id: `${userId}-${courseId}`
        });
    }

    const unrollUserFromCourse = async (user: string, course: string) => {
        return model.deleteOne({user, course});
    }

    async function findUsersForCourse(courseId: string) {
        const enrollments = await model.find({ course: courseId }).populate("user");
        return enrollments.map((enrollment) => enrollment.user);
    }


    return { enrollUserInCourse, unrollUserFromCourse, findUsersForCourse, findCoursesForUser };
}