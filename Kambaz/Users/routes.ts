import { DB, User } from "../Database/index";
import UsersDao from "./dao";
import { Express, Request, Response } from "express";

declare module 'express-session' {
    interface SessionData {
        currentUser?: User;
    }
}

export default function UserRoutes(app: Express, db: DB) {
    const dao = UsersDao(db);
    const createUser = async (req: Request, res: Response) => {
        const newUser = await dao.createUser(req.body);
        res.json(newUser);
    };
    const deleteUser = async (req: Request, res: Response) => {
        const userId = req.params.userId;
        await dao.deleteUser(userId);
        res.sendStatus(204);
    };
    const findAllUsers = async (req: Request, res: Response) => {
        const {role, name} = req.query;
        if (role) {
            const users = await dao.findUsersByRole(role as string);
            res.json(users);
            return;
        }
        if (name) {
            const users = await dao.findUsersByPartialName(name as string);
            res.json(users)
            return;
        }
        const users = await dao.findAllUsers();
        res.json(users);
    };
    const findUserById = async (req: Request, res: Response) => {
        const userId = req.params.userId;
        const user = await dao.findUserById(userId);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    };
    const findUsersByFirstName = async (req: Request, res: Response) => {
        const { firstName } = req.params;
        const users = await dao.findUsersByFirstName(firstName);
        res.json(users);
    };
    const updateUser = async (req: Request, res: Response) => {
        const userId = req.params.userId;
        const userUpdates = req.body;
        await dao.updateUser(userId, userUpdates);
        const currentUser = await dao.findUserById(userId);
        if (currentUser) {
            req.session["currentUser"] = currentUser;
            res.json(currentUser);
        } else {
            res.status(400).json({
                message: "Unable to update"
            });
        }
    };
    const updateUserByFaculty = async (req: Request, res: Response) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        const userId = req.params.userId;
        const userUpdates = req.body;
        await dao.updateUser(userId, userUpdates);
        res.sendStatus(200);
    }
    const signup = async (req: Request, res: Response) => {
        const user = await dao.findUserByUsername(req.body.username);
        if (user) {
            res.status(400).json(
                { message: "Username already in use" });
            return;
        }
        const currentUser = await dao.createUser(req.body);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };
    const signin = async (req: Request, res: Response) => {
        const { username, password } = req.body;
        const currentUser = await dao.findUserByCredentials(username, password);
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
    app.get("/api/users/:userId", findUserById);
    app.put("/api/users/:userId", updateUser);
    app.post("/api/users/FacultyControl/:userId", updateUserByFaculty);
    app.delete("/api/users/:userId", deleteUser);
    app.post("/api/users/signup", signup);
    app.post("/api/users/signin", signin);
    app.post("/api/users/signout", signout);
    app.post("/api/users/profile", profile);
}
