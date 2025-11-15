import { Express, Request, Response } from 'express';

let todos = [
    { id: 1, title: "Task 1", completed: false, description: "clean bed" },
    { id: 2, title: "Task 2", completed: true, description: "clean table" },
    { id: 3, title: "Task 3", completed: false, description: "clean bag" },
    { id: 4, title: "Task 4", completed: true, description: "clean bottle" },
] as {
    id: number;
    title: string;
    completed: boolean;
    description: string;
}[];

export default function WorkingWithArrays(app: Express) {
    const getTodos = (req: Request, res: Response) => {
        const { completed } = req.query;
        if (completed !== undefined) {
            const completedBool = completed === "true";
            const completedTodos = todos.filter((t) => t.completed === completedBool);
            res.json(completedTodos);
            return;
        }

        res.json(todos);
    };
    const getTodoById = (req: Request, res: Response) => {
        const { id } = req.params;
        const todo = todos.find((t) => t.id === parseInt(id));
        if (!todo) {
            res.status(404).json({
                message: `todo with Id = ${id} doesn't exist!`
            });
        }
        res.json(todo);
    };

    const createNewTodo = (req: Request, res: Response) => {
        const newTodo = {
            id: new Date().getTime(),
            title: "New Task",
            completed: false,
            description: "",
        };
        todos.push(newTodo);
        res.json(todos);
    };

    const removeTodo = (req: Request, res: Response) => {
        const { id } = req.params;
        const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
        todos.splice(todoIndex, 1);
        res.json(todos);
    };

    const updateTodoTitle = (req: Request, res: Response) => {
        const { id, title } = req.params;
        const todo = todos.find((t) => t.id === parseInt(id));
        if (!todo) {
            res.status(404).json({
                message: `todo with id=${id} not found!`
            });
        } else {
            todo.title = title;
        }
        res.json(todos);
    };

    const updateTodoCompletedStatus = (req: Request, res: Response) => {
        const { id, completed } = req.params;
        const todo = todos.find((t) => t.id === parseInt(id));
        if (!todo) {
            res.status(404).json({
                message: `todo with id=${id} not found!`
            });
        } else {
            todo.completed = completed === "false" ? false : true;
        }
        res.json(todo);
    }

    const updateTodoDescription = (req: Request, res: Response) => {
        const { id, description } = req.params;
        const todo = todos.find((t) => t.id === parseInt(id));
        if (!todo) {
            res.status(404).json({
                message: `todo with id=${id} not found!`
            });
        } else {
            todo.description = description;
        }
        res.json(todo);
    }

    const postNewTodo = (req: Request, res: Response) => {
        const newTodo = { ...req.body, id: new Date().getTime() };
        todos.push(newTodo);
        res.json(newTodo);
    };

    const deleteTodo = (req: Request, res: Response) => {
        const { id } = req.params;
        const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
        if (todoIndex === -1) {
            res.status(404).json({ message: `Unable to delete Todo with ID ${id}` });
            return;
        }

        todos.splice(todoIndex, 1);
        res.sendStatus(200);
    };

    const updateTodo = (req: Request, res: Response) => {
        const { id } = req.params;
        const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
        if (todoIndex === -1) {
            res.status(404).json({ message: `Unable to update Todo with ID ${id}` });
            return;
        }

        todos = todos.map((t) => {
            if (t.id === parseInt(id)) {
                return { ...t, ...req.body };
            }
            return t;
        });
        res.sendStatus(200);
    };

    app.put("/lab5/todos/:id", updateTodo);
    app.delete("/lab5/todos/:id", deleteTodo);
    app.get("/lab5/todos/:id/description/:description", updateTodoDescription);
    app.get("/lab5/todos/:id/completed/:completed", updateTodoCompletedStatus);
    app.get("/lab5/todos/:id/title/:title", updateTodoTitle);
    app.get("/lab5/todos/:id/delete", removeTodo);
    app.get("/lab5/todos/create", createNewTodo);
    app.post("/lab5/todos", postNewTodo);
    app.get("/lab5/todos", getTodos);
    app.get("/lab5/todos/:id", getTodoById);
};
