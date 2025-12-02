import { DB } from "../Database/index";
import EnrollmentsDao from "../Enrollments/dao";
import CoursesDao from "./dao";
import { Express, Request, Response } from "express";

export default function CourseRoutes(app: Express, db: DB) {
    const dao = CoursesDao(db);
    const enrollmentsDao = EnrollmentsDao(db);

    const findAllCourses = async (req: Request, res: Response) => {
        const courses = await dao.findAllCourses();
        res.send(courses);
    }

    const findCoursesForUser = async (req: Request, res: Response) => {
        let { userId } = req.params;
        if (userId === "current") {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            userId = currentUser._id;
        }
        const courses = await enrollmentsDao.findCoursesForUser(userId);
        res.json(courses);
    };

    const createCourse = async (req: Request, res: Response) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        const newCourse = await dao.createCourse(req.body);
        enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
        res.json(newCourse);
    };

    const deleteCourse = async (req: Request, res: Response) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        const { courseId } = req.params;
        const status = await dao.deleteCourse(courseId);
        res.send(status);
    }

    const updateCourse = async (req: Request, res: Response) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        const { courseId } = req.params;
        const courseUpdates = req.body;
        const status = await dao.updateCourse(courseId, courseUpdates);
        if (!status) {
            res.sendStatus(400);
            return;
        }
        res.json(status);
    }

    app.put("/api/courses/:courseId", updateCourse);
    app.delete("/api/courses/:courseId", deleteCourse);
    app.post("/api/users/current/courses", createCourse);
    app.get("/api/users/:userId/courses", findCoursesForUser);
    app.get("/api/courses", findAllCourses);
}
