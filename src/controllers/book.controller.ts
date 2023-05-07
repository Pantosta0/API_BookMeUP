import express, { Router } from "express";
import { createBook, deleteBook, getAllBooks, getBookById } from "../use-cases/book.use-case";

const router: Router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { avatarUrl, title, author, description } = req.body;
        const bookCreated = await createBook({ author, avatarUrl, title, description });
        return res.status(201).json({
            status: "success",
            data: bookCreated
        });
    } catch (error: any) {
        return res.status(500).json({ status: "error", message: error.message || "something went wrong" });
    }

});

router.get("/", async (req, res) => {
    const bookList = await getAllBooks();
    return res.status(200).json({
        status: "success",
        data: bookList
    });
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const book = await getBookById(parseInt(`${id}`));
    if (book == undefined) return res.status(404).json({ status: "error", message: "book not found" });
    return res.status(200).json({
        status: "success",
        data: book
    });
});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const book = await getBookById(parseInt(`${id}`));
    if (book == undefined) return res.status(404).json({ status: "error", message: "book not found" });
    await deleteBook(book.id);
    return res.status(204).json({
        status: "success",
        data: book
    });
});

export const BookController = router;