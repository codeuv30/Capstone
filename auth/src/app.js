import "dotenv/config";
import express from "express";
import morgan from "morgan";

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { startTransition } from "react";
import authRouter from "./routes/auth.routes.js";

const app = express();

app.use(morgan("dev"));
app.use(cookieParser());
app.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
}, (accessToken, refreshToken, profile, done) => {
    return done(null, done);
}));

app.use("/auth", authRouter)

export default app;