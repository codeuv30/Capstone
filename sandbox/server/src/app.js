import express from "express";
import morgan from "morgan";
import { createPod } from "./kubernetes/pod.js";
import { createService } from "./kubernetes/service.js";
import { v7 as uuid } from "uuid";
import cors from "cors";

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "PUT", "POST", "DELETE", "PATCH"]
}));

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/sandbox/health", (req, res) => {
    return res.status(200).json({
        message: "Sandbox API is healthy",
        status: "ok"
    });
});

app.post("/api/sandbox/start", async (req, res) => {
    console.log("COMING");
    
    const sandboxId = uuid();

    const [pod, service] = await Promise.all([
        createPod(sandboxId),
        createService(sandboxId)
    ]);

    return res.status(200).json({
        message: "Sandbox environtment created successfully",
        sandboxId,
        previewURL: `http://${sandboxId}.preview.localhost`
    });

});

export default app;