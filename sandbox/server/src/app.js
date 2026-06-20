import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import sandboxRouter from "./routes/sandbox.routes.js";

const app = express();

app.use(cors({
    origin: (origin, cb) => cb(null, true),
    methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/sandbox", sandboxRouter);

export default app;