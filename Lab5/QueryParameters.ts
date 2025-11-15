import { Express, Request, Response } from 'express';
export default function QueryParameters(app: Express) {
    const calculator = (req: Request, res: Response) => {
        const { a, b, operation } = req.query as {
            a: string;
            b: string;
            operation: string;
        };
        let result: number | string = 0;
        switch (operation) {
            case "add":
                result = parseInt(a) + parseInt(b);
                break;
            case "subtract":
                result = parseInt(a) - parseInt(b);
                break;
            case "multiply":
                result = parseInt(a) * parseInt(b);
                break;
            case "divide":
                result = parseInt(a) / parseInt(b);
                break;
            default:
                result = "Invalid operation";
        }
        res.send(result.toString());
    };
    app.get("/lab5/calculator", calculator);
}
