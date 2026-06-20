import { Router } from "express";
import { v7 as uuid } from "uuid";
import { createPod } from "../kubernetes/pod.js";
import { createService } from "../kubernetes/service.js";
import { createSandboxKey } from "../config/redis.js"
import { authMiddleware } from "../middlewares/auth.middleware.js";
import Project from "../models/project.model.js"

const sandboxRouter = Router();

sandboxRouter.get("/health", (req, res) => {
    return res.status(200).json({
        message: "Sandbox API is healthy",
        status: "ok"
    });
});

sandboxRouter.post("/project", authMiddleware, async (req, res) => {
    const { title } = req.body;

    const newProject = new Project({
        user: req.user.id,
        title
    });

    await newProject.save();

    return res.status(201).json({
        message: "Project created successfully",
        project: newProject
    });
});

sandboxRouter.post("/start", authMiddleware, async (req, res) => {
    const projectId = req.body.projectId;
    const user = req.user;

    const project = await Project.findOne({ _id: projectId, user: user.id });

    if(!project) {
        return res.status(404).json({
            message: "Project not found or access denied"
        });
    }

    if(project.user.toString() !== user.id.toString()) {
        return res.status(403).json({
            message: "Access denied"
        });
    }
    
    const sandboxId = uuid();

    const [pod, service] = await Promise.all([
        createPod(sandboxId),
        createService(sandboxId),
        createSandboxKey(sandboxId)
    ]);

    return res.status(200).json({
        message: "Sandbox environtment created successfully",
        sandboxId,
        previewURL: `http://${sandboxId}.preview.localhost`
    });

});

sandboxRouter.get("/projects", authMiddleware, async (req, res) => {
    const projects = await Project.find({ user: req.user.id });

    return res.status(200).json({
        message: "Projects retreived successfully",
        projects
    });
});

export default sandboxRouter;