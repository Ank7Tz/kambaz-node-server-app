import { Express, Request, Response } from "express";
import { DB } from "../Database/index";
import AssignmentsDao from "./dao";

export default function AssignmentsRoutes(app: Express, db: DB) {
    const dao = AssignmentsDao(db);

    const findAllAssignmentsForCourse = async (req: Request, res: Response) => {
        const { courseId } = req.params;
        const assignments = await dao.findAssignmentsForCourse(courseId);
        res.json(assignments);
    }

    const findAssignment = async (req: Request, res: Response) => {
        const { assignmentId } = req.params;
        const assignment = await dao.findAssignmentById(assignmentId);
        res.json(assignment);
    }

    const createAssignment = async (req: Request, res: Response) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }

        const { courseId } = req.params;
        if (!courseId) {
            res.sendStatus(400);
            return;
        }

        const newAssignment = req.body;

        const returnAssign = await dao.createAssignment(newAssignment);

        res.json(returnAssign);
    }

    const updateAssignment = async (req: Request, res: Response) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }

        const { assignmentId } = req.params;
        const assignment = req.body;

        const result = await dao.updateAssignment(assignmentId, assignment);
        res.json(result);
    }

    const deleteAssignment = async (req: Request, res: Response) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }

        const { courseId, assignmentId } = req.params;
        await dao.deleteAssignment(assignmentId);
        res.sendStatus(200);
    }

    app.post("/api/assignments/course/:courseId", createAssignment);
    app.get("/api/assignments/course/:courseId", findAllAssignmentsForCourse);
    app.get("/api/assignments/:assignmentId", findAssignment);
    app.put("/api/assignments/:assignmentId", updateAssignment);
    app.delete("/api/assignments/:assignmentId", deleteAssignment);
}