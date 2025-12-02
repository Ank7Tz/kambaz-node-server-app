import { Express, Request, Response } from 'express';

const assignment = {
    id: 1, title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10", completed: false, score: 0,
};

export default function WorkingWithObjects(app: Express) {
    const getAssignment = (req: Request, res: Response) => {
        res.json(assignment);
    };
    const getAssignmentTitle = (req: Request, res: Response) => {
        res.json(assignment.title);
    };
    const setAssignmentTitle = (req: Request, res: Response) => {
        const { newTitle } = req.params;
        assignment.title = newTitle;
        res.json(assignment);
    };

    const updateAssignmentScore = (req: Request, res: Response) => {
        const {score} = req.params;
        assignment.score = parseInt(score);
        res.json(assignment);
    }

    const updateAssignmentCompletedStatus = (req: Request, res: Response) => {
        const {status} = req.params;
        assignment.completed = status === "false" ? false : true;
        res.json(assignment);
    }
    
    app.get("/lab5/assignment/score/:score", updateAssignmentScore);
    app.get("/lab5/assignment/completed/:status", updateAssignmentCompletedStatus);
    app.get("/lab5/assignment/title/:newTitle", setAssignmentTitle);
    app.get("/lab5/assignment/title", getAssignmentTitle);
    app.get("/lab5/assignment", getAssignment);
};