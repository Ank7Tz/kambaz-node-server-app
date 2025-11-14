import type { Express } from 'express';

export default function Hello(app: Express) {
    app.get('/hello', (req, res) => {
        res.send('Hello World!')
    });
    app.get('/', (req, res) => {
        res.send('Welcome to Full Stack Development!')
    });
}