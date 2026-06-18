import "dotenv/config";
import express from "express";
import morgan from "morgan";

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";

import dns from "dns";

const app = express();

app.use(morgan("dev"));
app.use(cookieParser());
app.use(passport.initialize());

dns.setServers(['8.8.8.8', '1.1.1.1']);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

app.use("/api/auth", authRouter)

app.get("/api/auth/healthz", (req, res) => {
    return res.status(200).json({ status: "ok" });
});

app.get("/api/auth/readyz", (req, res) => {
    return res.status(200).json({ status: "ok" });
});

export default app;