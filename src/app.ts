import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import { routes } from "../src/routes/main";

const app = express();
app.use(cors());
app.use("/webhook/stripe", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(express.static("public"));
app.use(routes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: "Ocorreu algum erro" });
});

export default app;
