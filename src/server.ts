import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import { routes } from './routes/main.js';

const app = express();

app.use(cors());

app.use('/webhook/stripe', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(express.static('public'))
app.use(routes)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Ocorreu algum erro' });
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server is running on ${port} 👽 🤙`);
});