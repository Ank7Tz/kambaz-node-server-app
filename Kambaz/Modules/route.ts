import { DB } from "../Database/index";
import ModulesDao from "./dao";
import { Express, Request, Response } from "express";
export default function ModulesRoutes(app: Express, db: DB) {
    const dao = ModulesDao(db);
    const findModulesForCourse = (req: Request, res: Response) => {
        const { courseId } = req.params;
        const modules = dao.findModulesForCourse(courseId);
        res.json(modules);
    }
    const createModuleForCourse = (req: Request, res: Response) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        const { courseId } = req.params;
        const module = {
            ...req.body,
            course: courseId,
        };
        const newModule = dao.createModule(module);
        res.send(newModule);
    }
    const deleteModule = (req: Request, res: Response) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        const { moduleId } = req.params;
        const status = dao.deleteModule(moduleId);
        res.send(status);
    }
    const updateModule = async (req: Request, res: Response) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        const { moduleId } = req.params;
        const moduleUpdates = req.body;
        const status = await dao.updateModule(moduleId, moduleUpdates);
        res.send(status);
    }
    app.put("/api/modules/:moduleId", updateModule);
    app.delete("/api/modules/:moduleId", deleteModule);
    app.post("/api/courses/:courseId/modules", createModuleForCourse);
    app.get("/api/courses/:courseId/modules", findModulesForCourse);
}
