import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne } from "typeorm";
import { User } from "./user.model";
import { Book } from "./book.model";

@Entity()
export class Rank {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(() => User, (user) => user.readingList)
    user: User;

    @ManyToOne(() => Book, book => book.ranks)
    book: Book;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;

    constructor(user: User, book: Book) {
        this.user = user;
        this.book = book;
    }
}
