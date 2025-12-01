import { v4 as uuidv4 } from "uuid";
import { Course, DB, Enrollment } from "../Database/index";
import model from "./model";
import enrollmentModel from "../Enrollments/model";

export default function CoursesDao(db: DB) {
    async function findAllCourses() {
        return model.find({}, { name: 1, description: 1, image: 1 });
    }

    async function createCourse(course: Course): Promise<Course> {
        const newCourse = { ...course, _id: uuidv4(), modules: [] };
        const created = await model.create(newCourse);
        return created.toObject<Course>();
    }

    async function deleteCourse(courseId: string) {
        await enrollmentModel.deleteMany({course: courseId});
        return model.deleteOne({ _id: courseId });
    }

    async function updateCourse(courseId: string, courseUpdates: Course): Promise<Course | null> {
        await model.updateOne({ _id: courseId }, { $set: courseUpdates });
        const course = await model.findById(courseId);
        return course ? course.toObject<Course>() : null;
    }


    return {
        findAllCourses,
        createCourse,
        deleteCourse,
        updateCourse,
    };
}
