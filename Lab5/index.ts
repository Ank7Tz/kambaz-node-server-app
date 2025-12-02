import { Express, Request, Response } from 'express';
import PathParameter from './PathParameters';
import QueryParameters from './QueryParameters';
import WorkingWithObjects from './WorkingWithObjects';
import ModuleHandler from './ModuleHandler';
import WorkingWithArrays from './WorkingWithArrays';

export default function Lab5(app: Express) {
    const welcomeMsg = (req: Request, res: Response) => {
        res.send("Welcome to Lab 5");
    }
    app.get("/lab5/welcome", welcomeMsg);
    PathParameter(app);
    QueryParameters(app);
    WorkingWithObjects(app);
    ModuleHandler(app);
    WorkingWithArrays(app);
}