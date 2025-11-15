import { Express, Request, Response } from 'express';

export default function ModuleHandler(app: Express) {
    const module = {
        id: "xyz123",
        name: "Backend Development",
        description: "Learning backend development",
        course: "Web Development",
    };
    const provideModule = (req: Request, res: Response) => {
        res.json(module);
    }

    const provideModuleName = (req: Request, res: Response) => {
        res.json(module.name);
    }

    const updateModuleName = (req: Request, res: Response) => {
        const { name } = req.params;
        module.name = name;
        res.json(module);
    }

    const updateModuleDescription = (req: Request, res: Response) => {
        const { desc } = req.params
        module.description = desc;
        res.json(module);
    }


    app.get("/lab5/module/description/:desc", updateModuleDescription);
    app.get("/lab5/module/name/:name", updateModuleName);
    app.get("/lab5/module/name", provideModuleName);
    app.get("/lab5/module", provideModule);
}