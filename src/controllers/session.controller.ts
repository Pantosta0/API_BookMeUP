import express, { Router } from "express";
import { createBook, deleteBook, getAllBooks, getBookById } from "../use-cases/book.use-case";
import { addLectureToUser, getUserById } from "../use-cases/user.use-case";
import { getAllUSerSessions } from "../use-cases/session.use-case";

const router: Router = express.Router();


router.get("/:userId", async (req, res) => {
    const id = req.params.userId;
    const user = await getUserById(parseInt(`${id}`));
    if (user == undefined) return res.status(404).json({ status: "error", message: "user not found" });

    const sessions = await getAllUSerSessions(user.id);

    return res.status(200).json({
        status: "success",
        data: sessions
    });
});
export const SessionController = router;