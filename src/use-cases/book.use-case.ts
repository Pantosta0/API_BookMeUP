import { getRepository } from "typeorm";
import { Book } from "../models/book.model";

export type bookCreateInput = {
    avatarUrl: string;
    title: string;
    author: string;
    description: string;
}

export async function createBook(data: bookCreateInput): Promise<Book> {
    const bookRepository = getRepository(Book);
    const bookEntity = <Book>data;
    const book = await bookRepository.save(bookEntity);
    return book;
}


export async function getAllBooks(): Promise<Book[]> {
    const bookRepository = getRepository(Book);
    const books = await bookRepository.find({ relations: ["readingLists", "ranks"] });
    return books;
}

export async function getBookById(id: number): Promise<Book | undefined> {
    const bookRepository = getRepository(Book);
    const book = await bookRepository.findOne(id);
    return book;
}

export async function deleteBook(id: number): Promise<Book | undefined> {
    const bookRepository = getRepository(Book);
    const book = await bookRepository.findOne(id);
    if (book !== undefined) {
        await bookRepository.softRemove(book);
    }
    return book;
}