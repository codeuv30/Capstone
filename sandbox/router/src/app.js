import express from "express";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

app.get("/api/status/healthz", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/api/status/readyz", (req, res) => {
  res.status(200).json({ status: "ready" });
});

const proxies = {};
const agentProxies = {};

function getProxy(sandboxId, target) {
  if (!proxies[sandboxId]) {
    proxies[sandboxId] = createProxyMiddleware({
      target,
      changeOrigin: true,
      ws: true,
    });
  }

  return proxies[sandboxId];
}

function getAgentProxy (sandboxId, target) {
  if(!agentProxies[ sandboxId ]) {
    agentProxies[sandboxId] = createProxyMiddleware({
      target,
      changeOrigin: true,
      ws: true
    })
  }

  return agentProxies[ sandboxId ];
}

app.use((req, res, next) => {
  const host = req.headers.host;

  const sandboxId = host.split(".")[0];

  if (host.split(".")[1] === "agent") {

    const target = `http://sandbox-service-${sandboxId}:3000`;

    return getAgentProxy(sandboxId, target)(req, res, next);

  } else if (host.split(".")[1] === "preview") {

    const target = `http://sandbox-service-${sandboxId}`;

    return getProxy(sandboxId, target)(req, res, next);

  }
});

export default app;
