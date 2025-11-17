import { DB } from "../Database/index";
import EnrollmentsDao from "../Enrollments/dao";
import CoursesDao from "./dao";
import { Express, Request, Response } from "express";

export default function CourseRoutes(app: Express, db: DB) {
    const dao = CoursesDao(db);
    const enrollmentsDao = EnrollmentsDao(db);

    const findAllCourses = (req: Request, res: Response) => {
        const courses = dao.findAllCourses();
        res.send(courses);
    }

    const findCoursesForEnrolledUser = (req: Request, res: Response) => {
        let { userId } = req.params;
        if (userId === "current") {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            userId = currentUser._id;
        }
        const courses = dao.findCoursesForEnrolledUser(userId);
        res.json(courses);
    };

    const createCourse = (req: Request, res: Response) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        const newCourse = dao.createCourse(req.body);
        enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
        res.json(newCourse);
    };

    const deleteCourse = (req: Request, res: Response) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        const { courseId } = req.params;
        const status = dao.deleteCourse(courseId);
        res.send(status);
    }

    const updateCourse = (req: Request, res: Response) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        const { courseId } = req.params;
        const courseUpdates = req.body;
        const status = dao.updateCourse(courseId, courseUpdates);
        if (!status) {
            res.sendStatus(400);
            return;
        }
        res.json(status);
    }

    app.put("/api/courses/:courseId", updateCourse);
    app.delete("/api/courses/:courseId", deleteCourse);
    app.post("/api/users/current/courses", createCourse);
    app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
    app.get("/api/courses", findAllCourses);
}
