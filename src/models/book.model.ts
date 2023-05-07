import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { LectureList } from "./lecture-list.model";

@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    title!: string;

    @Column({ nullable: true })
    description!: string;

    @Column({ nullable: true })
    author!: string;

    @Column({ nullable: true })
    avatarUrl!: string;

    @ManyToOne(() => LectureList, readingList => readingList.books)
    readingList?: LectureList;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;

    constructor(title: string, description: string, author: string, avatarUrl: string) {
        this.title = title;
        this.description = description;
        this.author = author;
        this.avatarUrl = avatarUrl;
    }
}