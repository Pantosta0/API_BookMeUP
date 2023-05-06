import express, { Router } from "express";
import { getRepository } from "typeorm";
import { User } from "../models/user.model";


const router: Router = express.Router();

router.get("/", async (req, res) => {
    const userRepository = getRepository(User);
    const users = await userRepository.find();
    res.json(users);
});

router.post("/", async (req, res) => {
    const userRepository = getRepository(User);
    const { name, email } = req.body;
    const user = new User();
    user.name = name;
    user.email = email;
    await userRepository.save(user);
    res.json(user);
});

export const UserController = router;
