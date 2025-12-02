import { DB } from "../Database/index";
import {Express, Request, Response} from "express";
import EnrollmentsDao from "./dao";

export default function EnrollmentRoute(app: Express, db: DB) {
    const dao = EnrollmentsDao(db);
    const enrollUserToCourse = async (req: Request, res: Response) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        const {userId, courseId} = req.params;
        await dao.enrollUserInCourse(userId, courseId);
        res.sendStatus(200);
    }

    const unrollUserFromCourse = async (req: Request, res: Response) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }

        const {userId, courseId} = req.params;
        await dao.unrollUserFromCourse(userId, courseId);
        res.sendStatus(200);
    }

    const fetchAllPeopleForCourse = async (req: Request, res: Response) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }

        const {courseId} = req.params;
        const users = await dao.findUsersForCourse(courseId);
        res.json(users);
    }


    app.get("/api/courses/:courseId/users", fetchAllPeopleForCourse);
    app.put("/api/users/:userId/courses/:courseId", enrollUserToCourse);
    app.delete("/api/users/:userId/courses/:courseId", unrollUserFromCourse);
}