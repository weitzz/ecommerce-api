import express from "express";
import cors from "cors";
import { routes } from "../src/routes/main";
import { errorHandler } from "./shared/errors/error-handler";

const app = express();
app.use(cors());
app.use("/webhook/stripe", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(express.static("public"));
app.use(routes);
app.use(errorHandler);

export default app;
