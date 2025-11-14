import express from 'express'
import Hello from './Hello';
const app = express();
Hello(app);
app.listen(4000);