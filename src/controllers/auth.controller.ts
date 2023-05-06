import express, { Router } from "express";
import { createUser, getUserByEmail, getUserByEmailOrUsername } from "../use-cases/user.use-case";
import { comparePasswords, hashPassword } from "../utils/global.util";
import { LectureList } from "../models/lecture-list.model";

const router: Router = express.Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (email == undefined || typeof email !== "string" || email.length < 1) return res.status(400).json({ status: "error", message: "invalid email" });
    if (password == undefined || typeof password !== "string" || password.length < 1) return res.status(400).json({ status: "error", message: "invalid password" });
    let user = await getUserByEmail(email);
    if (user == undefined) return res.status(404).json({ status: "error", message: "user not found" });
    if (await comparePasswords(password, user!.password) == false) return res.status(401).json({ status: "error", message: "no auth" });        
    user.readingList = user.readingList ? user.readingList : undefined;
    return res.status(200).json({
        status: "success",
        data: user
    });
});

router.post("/register", async (req, res) => {
    const { email, password, username, description } = req.body;
    // validate email
    if (email == undefined || typeof email !== "string" || email.length < 1) return res.status(400).json({ status: "error", message: "invalid email" });
    // validate password
    if (password == undefined || typeof password !== "string" || password.length < 1) return res.status(400).json({ status: "error", message: "invalid password" });
    // validate username
    if (username == undefined || typeof username !== "string" || username.length < 1) return res.status(400).json({ status: "error", message: "invalid username" });
    // validate description
    if (description == undefined || typeof description !== "string" || description.length < 1) return res.status(400).json({ status: "error", message: "invalid description" });
    // validate user existence with email and username
    if (await getUserByEmailOrUsername(email, username) !== undefined) return res.status(400).json({ status: "error", message: "user already exist" });
    // create new user
    const userCreated = await createUser({ email, password, username, description });
    return res.status(201).json({
        status: "success",
        data: userCreated
    });
});

export const AuthController = router;