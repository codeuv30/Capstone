import { Router } from "express";
import passport from "passport";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const authRouter = Router();

authRouter.get("/google", passport.authenticate("google", { scope: [ "profile", "email" ] }));

authRouter.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" } ), async (req, res) => {
    try {
        const { id, displayName, emails, photos } = req.user;

        let user = User.findOne({ googleId: id, name: displayName, email: emails[0] });

        if(!user) {
            user = await User.create({
                googleId: id,
                name: displayName,
                email: emails[0].value,
                avatar: photos[0].value
            });

            await user.save();
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie("token", token, { httpOnly: true });
        res.redirect("/"); 
    } catch (error) {
        console.error("Error during Google authentication: ", err);
        res.redirect("/");
    }
});

export default authRouter;