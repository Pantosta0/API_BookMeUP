import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { User } from "./user.model";
import { Book } from "./book.model";

@Entity()
export class LectureList {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(() => User, (user) => user.readingList)
    user: User;

    @OneToMany(() => Book, book => book.readingList)
    books?: Book[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;

    constructor(user: User, books?: Book[]) {
        this.user = user;
        this.books = books;
    }
}
