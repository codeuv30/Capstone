import { Router } from "express";
import passport from "passport";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendAuthNotification } from "../config/mq.js";

const authRouter = Router();

authRouter.get("/google", passport.authenticate("google", {
    scope: [ "profile", "email" ],
    session: false
}));

authRouter.get("/google/callback", passport.authenticate("google", {
    session: false,
    failureRedirect: "/" 
} ), async (req, res) => {
    try {
        const { id, displayName, emails, photos } = req.user;

        let user = await User.findOne({ googleId: id, name: displayName, email: emails[0].value });

        if(!user) {
            user = await User.create({
                googleId: id,
                name: displayName,
                email: emails[0].value,
                avatar: photos[0].value
            });
        }

        await sendAuthNotification({
            userId: user._id,
            action: "google_login",
            timestamp: new Date(),
            email: emails[ 0 ].value
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie("token", token, { httpOnly: true });
        res.redirect("http://localhost:8080");
    } catch (error) {
        console.error("Error during Google authentication: ", error);
        res.redirect("http://localhost:8080");
    }
});

export default authRouter;