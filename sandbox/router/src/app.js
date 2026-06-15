import express from "express";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

app.use(morgan("dev"));

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
      on: {
        proxyReq: (proxyReq, req) => {
          console.log(`[proxy] → ${target}${req.url}`);
        },
        proxyRes: (proxyRes, req) => {
          console.log(`[proxy] ← ${proxyRes.statusCode} ${req.url}`);
        },
        error: (err, req, res) => {
          console.error(
            `[proxy error] code=${err.code} msg=${err.message} target=${target}`,
          );
          res.status(502).json({ error: err.message, code: err.code, target });
        },
      },
    });
  }

  return proxies[sandboxId];
}

function getAgentProxy(sandboxId, target) {
  if (!agentProxies[sandboxId]) {
    agentProxies[sandboxId] = createProxyMiddleware({
      target,
      changeOrigin: true,
      ws: true,
    });
  }

  return agentProxies[sandboxId];
}

app.use((req, res, next) => {
  const host = req.headers.host;

  const sandboxId = host.split(".")[0];

  if (host.split(".")[1] === "agent") {
    console.log("REQUEST REACHING SERVER FROM AGENT");

    const target = `http://sandbox-service-${sandboxId}:3000`;

    return getAgentProxy(sandboxId, target)(req, res, next);
  } else if (host.split(".")[1] === "preview") {
    console.log("REQUEST REACHING SERVER FROM PREVIEW");

    const target = `http://sandbox-service-${sandboxId}:80`;

    return getProxy(sandboxId, target)(req, res, next);
  }

  return res.status(404).json({ error: "Unknown host", host });
});

export default app;
