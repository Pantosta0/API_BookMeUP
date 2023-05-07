import express, { Router } from "express";
import { createBook, deleteBook, getAllBooks, getBookById } from "../use-cases/book.use-case";
import { addLectureToUser, getUserById } from "../use-cases/user.use-case";

const router: Router = express.Router();


router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const user = await getUserById(parseInt(`${id}`));
    if (user == undefined) return res.status(404).json({ status: "error", message: "user not found" });
    return res.status(200).json({
        status: "success",
        data: user
    });
});

router.post("/lecture", async (req, res) => {
    try {
        const { userId, bookId } = req.query;
        let user = await getUserById(parseInt(`${userId}`));
        const book = await getBookById(parseInt(`${bookId}`));

        if (user == undefined) return res.status(404).json({ status: "error", message: "user not found" });
        if (book == undefined) return res.status(404).json({ status: "error", message: "book not found" });


        const bookSaved = user.readingList?.books?.find(el => book.id == el.id);        

        if (bookSaved !== undefined) return res.status(400).json({ status: "error", message: "book already saved into lecture list" });
        
        user = await addLectureToUser(user, book);

        return res.status(200).json({
            status: "success",
            data: user
        });
    } catch (error: any) {
        return res.status(500).json({
            status: "error",
            message: error.message || "something went wrong"
        });
    }
});

export const UserController = router;