import { DB } from "../Database/index";
import ModulesDao from "./dao";
import { Express, Request, Response } from "express";
export default function ModulesRoutes(app: Express, db: DB) {
    const dao = ModulesDao(db);
    const findModulesForCourse = async (req: Request, res: Response) => {
        const { courseId } = req.params;
        const modules = await dao.findModulesForCourse(courseId);
        res.json(modules);
    }
    const createModuleForCourse = async (req: Request, res: Response) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        const { courseId } = req.params;
        const module = {
            ...req.body,
        };
        const newModule = await dao.createModule(courseId, module);
        res.send(newModule);
    }
    const deleteModule = async (req: Request, res: Response) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        const { courseId, moduleId } = req.params;
        const status = await dao.deleteModule(courseId, moduleId);
        res.send(status);
    }
    const updateModule = async (req: Request, res: Response) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        const { courseId, moduleId } = req.params;
        const moduleUpdates = req.body;
        const status = await dao.updateModule(courseId, moduleId, moduleUpdates);
        res.send(status);
    }
    app.put("/api/courses/:courseId/modules/:moduleId", updateModule);
    app.delete("/api/courses/:courseId/modules/:moduleId", deleteModule);
    app.post("/api/courses/:courseId/modules", createModuleForCourse);
    app.get("/api/courses/:courseId/modules", findModulesForCourse);
}
