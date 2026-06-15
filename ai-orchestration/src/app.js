import express from "express";
import morgan from "morgan";
import agentRouter from "./routes/agent.routes.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

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