import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.model";
import { Book } from "./book.model";

@Entity()
export class Rank {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    score: number;

    @ManyToOne(() => User, (user) => user.ranks)
    @JoinColumn()
    user: User;

    @ManyToOne(() => Book, book => book.ranks)
    @JoinColumn()
    book: Book;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;

    constructor(score: number, user: User, book: Book) {
        this.score = score;
        this.user = user;
        this.book = book;
    }
}
