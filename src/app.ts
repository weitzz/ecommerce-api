import express from "express";
import cors from "cors";
import { routes } from "@/routes";
import { errorHandler } from "./shared/errors/error-handler";
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express'
import { swaggerConfig } from './docs/swagger'


const app = express();
const allowedOrigins = (process.env.FRONT_END_URL || "http://localhost:3000")
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig))
app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true)
        }

        return callback(new Error("Origin não permitida pelo CORS"))
    },
    credentials: true
}));
app.use("/webhook/stripe", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser())
app.use(routes);
app.use(errorHandler);


export default app;
