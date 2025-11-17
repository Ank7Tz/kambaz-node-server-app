import { DB } from "../Database/index.js";
import {Express, Request, Response} from "express";
import EnrollmentsDao from "./dao.js";

export default function EnrollmentRoute(app: Express, db: DB) {
    const dao = EnrollmentsDao(db);
    const enrollUserToCourse = (req: Request, res: Response) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        const {userId, courseId} = req.params;
        dao.enrollUserInCourse(userId, courseId);
        res.sendStatus(200);
    }

    const unrollUserFromCourse = (req: Request, res: Response) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }

        const {userId, courseId} = req.params;
        dao.unrollUserFromCourse(userId, courseId);
        res.sendStatus(200);
    }

    const fetchAllPeopleForCourse = (req: Request, res: Response) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }

        const {courseId} = req.params;
        const users = dao.allPeopleFromCourse(courseId);
        res.json(users);
    }


    app.get("/api/enrollments/:courseId", fetchAllPeopleForCourse);
    app.put("/api/enrollments/:userId/:courseId", enrollUserToCourse);
    app.delete("/api/enrollments/:userId/:courseId", unrollUserFromCourse);
}