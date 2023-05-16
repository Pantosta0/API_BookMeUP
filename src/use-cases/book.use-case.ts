import { getRepository } from "typeorm";
import { Book } from "../models/book.model";

export type bookCreateInput = {
    avatarUrl: string;
    title: string;
    author: string;
    description: string;
    pages: number;
}

export type bookSearchInput = {
    title?: string;
    author?: string;
    description?: string;
    dynamic?: string;
}

export async function createBook(data: bookCreateInput): Promise<Book> {
    data.title = data.title.toUpperCase();
    data.author = data.author.toUpperCase();
    data.description = data.description.toUpperCase();
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
    const book = await bookRepository.findOne(id, { relations: ['ranks'] });
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

export async function searchBooks(query: bookSearchInput): Promise<Book[]> {
    const bookRepository = getRepository(Book);
    let builder = await bookRepository.createQueryBuilder('book');

    builder = builder.leftJoinAndSelect('book.readingLists', 'readingLists').leftJoinAndSelect('book.ranks', 'ranks');



    if (query.dynamic !== undefined) {
        builder = builder.where('book.author LIKE :author', { author: `%${query.dynamic.toUpperCase()}%` })
        builder = builder.orWhere('book.title LIKE :title', { title: `%${query.dynamic.toUpperCase()}%` })
        builder = builder.orWhere('book.description LIKE :description', { description: `%${query.dynamic.toUpperCase()}%` })
    } else {
        if (query.title !== undefined) {
            builder = builder.where('book.title LIKE :title', { title: `%${query.title.toUpperCase()}%` })
        }

        if (query.author !== undefined) {
            builder = builder.where('book.author LIKE :author', { author: `%${query.author.toUpperCase()}%` })
        }

    }

    const books = await builder.getMany();

    return books;
}