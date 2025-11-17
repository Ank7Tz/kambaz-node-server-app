import { v4 as uuidv4 } from "uuid";
import { Course, DB, Enrollment } from "../Database";

export default function CoursesDao(db: DB) {
    function findAllCourses() {
        return db.courses;
    }

    function findCoursesForEnrolledUser(userId: string) {
        const { courses, enrollments } = db;
        const enrolledCourses = courses.filter((course: Course) =>
            enrollments.some((enrollment: Enrollment) => enrollment.user === userId && enrollment.course === course._id));
        return enrolledCourses;
    }

    function createCourse(course: Course) {
        const newCourse = { ...course, _id: uuidv4() };
        db.courses = [...db.courses, newCourse];
        return newCourse;
    }

    function deleteCourse(courseId: string) {
        const { courses, enrollments } = db;
        db.courses = courses.filter((course) => course._id !== courseId);
        db.enrollments = enrollments.filter(
            (enrollment) => enrollment.course !== courseId
        );
    }

    function updateCourse(courseId: string, courseUpdates: Course) {
        const { courses } = db;
        const course = courses.find((course) => course._id === courseId);
        if (!course) {
            return null;
        }
        Object.assign(course, courseUpdates);
        return course;
    }


    return {
        findAllCourses,
        findCoursesForEnrolledUser,
        createCourse,
        deleteCourse,
        updateCourse,
    };
}
