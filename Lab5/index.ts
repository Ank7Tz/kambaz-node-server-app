import { Express, Request, Response } from 'express';
import PathParameter from './PathParameters.js';
import QueryParameters from './QueryParameters.js';
import WorkingWithObjects from './WorkingWithObjects.js';
import ModuleHandler from './ModuleHandler.js';
import WorkingWithArrays from './WorkingWithArrays.js';

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