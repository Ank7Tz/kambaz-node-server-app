import { Express, Request, Response } from 'express';
export default function PathParameter(app: Express) {
    const add = (req: Request, res: Response) => {
        const {a, b} = req.params;
        const sum = parseInt(a) + parseInt(b);
        res.send(sum.toString());
    }

    const substract = (req: Request, res: Response) => {
        const {a, b} = req.params;
        const sum = parseInt(a) - parseInt(b);
        res.send(sum.toString());
    }

    app.get("/lab5/add/:a/:b", add);
    app.get("/lab5/subtract/:a/:b", substract);
}