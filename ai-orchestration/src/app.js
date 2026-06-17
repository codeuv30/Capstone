import express from "express";
import morgan from "morgan";
import agentRouter from "./routes/agent.routes.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use(cors({
    origin: "*",
    methods: ["GET", "PUT", "POST", "DELETE", "PATCH"]
}));

app.use("/api/ai/agent", agentRouter);

app.get("/api/ai/healthz", (req, res) => {
    res.status(200).json({
        status: 'ok'
    });
});

app.get("/api/ai/readyz", (req, res) => {
    res.status(200).json({
        status: 'ok'
    });
});

export default app;