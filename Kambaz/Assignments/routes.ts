import { Express, Request, Response } from "express";
import { DB } from "../Database/index.js";
import AssignmentsDao from "./dao.js";

export default function AssignmentsRoutes(app: Express, db: DB) {
    const dao = AssignmentsDao(db);

    const findAllAssignmentsForCourse = (req: Request, res: Response) => {
        const { courseId } = req.params;
        const assignments = dao.findAssignmentsForCourse(courseId);
        res.json(assignments);
    }

    const findAssignment = (req: Request, res: Response) => {
        const { courseId, assignmentId} = req.params;
        const assignment = dao.findAssignmentById(courseId, assignmentId);
        res.json(assignment);
    }

    const createAssignment = (req: Request, res: Response) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }

        const {courseId} = req.params;
        if (!courseId) {
            res.sendStatus(400);
            return;
        }

        const newAssignment = req.body;

        const returnAssign = dao.createAssignment(newAssignment);

        res.json(returnAssign);
    }

    const updateAssignment = (req: Request, res: Response) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }

        const {courseId, assignmentId} = req.params;
        const assignment = req.body;

        const result = dao.updateAssignment(courseId, assignmentId, assignment);
        res.json(result);
    }

    const deleteAssignment = (req: Request, res: Response) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }

        const {courseId, assignmentId} = req.params;
        dao.deleteAssignment(courseId, assignmentId);
        res.sendStatus(200);
    }

    app.post("/api/assignments/:courseId", createAssignment);
    app.get("/api/assignments/:courseId", findAllAssignmentsForCourse);
    app.get("/api/assignments/:courseId/:assignmentId", findAssignment);
    app.put("/api/assignments/:courseId/:assignmentId", updateAssignment);
    app.delete("/api/assignments/:courseId/:assignmentId", deleteAssignment);
}