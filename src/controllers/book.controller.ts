import express, { Router } from "express";
import { createBook, deleteBook, getAllBooks, getBookById, searchBooks } from "../use-cases/book.use-case";
import { getUserById } from "../use-cases/user.use-case";
import { createRank, getRankByUserAndBok, updateRank } from "../use-cases/rank.user-case";
import { orderBookByTrend } from "../utils/book.utils";

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


router.get("/search", async (req, res) => {    
    let bookList = await searchBooks(req.query);
    return res.status(201).json({
        status: "success",
        data: bookList
    });
});

router.get("/", async (req, res) => {
    const bookList = await getAllBooks();
    return res.status(200).json({
        status: "success",
        data: bookList
    });
});




router.get("/trend", async (req, res) => {
    let bookList = await getAllBooks();
    bookList = orderBookByTrend(bookList);
    return res.status(201).json({
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

router.post("/rank", async (req, res) => {
    const { score, userId, bookId } = req.query;

    let user = await getUserById(parseInt(`${userId}`));
    if (user == undefined) return res.status(404).json({ status: "error", message: "user not found" });

    let book = await getBookById(parseInt(`${bookId}`));
    if (book == undefined) return res.status(404).json({ status: "error", message: "book not found" });

    const foundRank = await getRankByUserAndBok(user.id, book.id);
    if (foundRank !== undefined) {
        await updateRank(foundRank.id, { score: parseInt(`${score}`) });
    } else {
        user = await createRank(parseInt(`${score}`), user, book);
    }

    book = await getBookById(parseInt(`${bookId}`));

    return res.status(201).json({
        status: "success",
        data: book
    });
});




export const BookController = router;