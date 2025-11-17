import { DB, User } from "../Database/index.js";
import UsersDao from "./dao.js";
import { Express, Request, Response } from "express";

declare module 'express-session' {
    interface SessionData {
        currentUser?: User;
    }
}

export default function UserRoutes(app: Express, db: DB) {
    const dao = UsersDao(db);
    const createUser = (req: Request, res: Response) => { };
    const deleteUser = (req: Request, res: Response) => { };
    const findAllUsers = (req: Request, res: Response) => { };
    const findUserById = (req: Request, res: Response) => {
        const userId = req.params.userId;
        const user = dao.findUserById(userId);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    };
    const findUsersByFirstName = (req: Request, res: Response) => {
        const { firstName } = req.params;
        const users = dao.findUsersByFirstName(firstName);
        res.json(users);
    };
    const updateUser = (req: Request, res: Response) => {
        const userId = req.params.userId;
        const userUpdates = req.body;
        dao.updateUser(userId, userUpdates);
        const currentUser = dao.findUserById(userId) || null;
        if (currentUser) {
            req.session["currentUser"] = currentUser;
            res.json(currentUser);
        } else {
            res.status(400).json({
                message: "Unable to update"
            });
        }
    };
    const signup = (req: Request, res: Response) => {
        const user = dao.findUserByUsername(req.body.username);
        if (user) {
            res.status(400).json(
                { message: "Username already in use" });
            return;
        }
        const currentUser = dao.createUser(req.body);
        req.session["currentUser"] = currentUser as any;
        res.json(currentUser);
    };
    const signin = (req: Request, res: Response) => {
        const { username, password } = req.body;
        const currentUser = dao.findUserByCredentials(username, password) || null;
        if (currentUser) {
            req.session["currentUser"] = currentUser;
            res.json(currentUser);
        } else {
            res.status(401).json({
                message: "Unable to login. Try again later"
            })
        }
    };
    const signout = (req: Request, res: Response) => {
        req.session.destroy(() => {
            res.sendStatus(200);
        });
    };
    const profile = (req: Request, res: Response) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        res.json(currentUser);
    };
    app.post("/api/users", createUser);
    app.get("/api/users", findAllUsers);
    app.get("/api/users/search/firstName/:firstName", findUsersByFirstName);
    app.get("/api/users/search/userId/:userId", findUserById);
    app.put("/api/users/:userId", updateUser);
    app.delete("/api/users/:userId", deleteUser);
    app.post("/api/users/signup", signup);
    app.post("/api/users/signin", signin);
    app.post("/api/users/signout", signout);
    app.post("/api/users/profile", profile);
}
