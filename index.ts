import express from 'express'
import Hello from './Hello';
import Lab5 from './Lab5';
import cors from "cors";
import UserRoutes from './Kambaz/Users/routes';
import Database from './Kambaz/Database';
import "dotenv/config";
import session, { Session, SessionOptions } from "express-session";
import CourseRoutes from './Kambaz/Courses/routes';
import ModulesRoutes from './Kambaz/Modules/route';
import AssignmentsRoutes from './Kambaz/Assignments/routes';
import EnrollmentRoute from './Kambaz/Enrollments/route';
import mongoose from "mongoose";

const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";
mongoose.connect(CONNECTION_STRING);

mongoose.connection.on("connected", () => {
    console.log("connected");
});

const app = express();

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL || "http://localhost:3000",
}));

const sessionOptions: SessionOptions = {
    secret: process.env.SESSION_SECRET || "kambaz",
    resave: false,
    saveUninitialized: false
}

if (process.env.SERVER_ENV !== "development") {
    sessionOptions.proxy = true;
    sessionOptions.cookie = {
        sameSite: "none",
        secure: true,
    };
}

app.use(session(sessionOptions));

app.use(express.json());
Hello(app);
Lab5(app);
UserRoutes(app, Database);
CourseRoutes(app, Database);
ModulesRoutes(app, Database);
AssignmentsRoutes(app, Database);
EnrollmentRoute(app, Database);

app.listen(process.env.PORT || 4000);