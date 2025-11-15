import express from 'express'
import Hello from './Hello';
import Lab5 from './Lab5';
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
Hello(app);
Lab5(app);
app.listen(process.env.PORT || 4000);