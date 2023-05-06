import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { LectureList } from "./lecture-list.model";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    email!: string;

    @Column({ nullable: true })
    password!: string;

    @Column({ nullable: true })
    username!: string;

    @Column({ nullable: true })
    description!: string;

    @OneToOne(() => LectureList, (readingList) => readingList.user)
    @JoinColumn()
    readingList?: LectureList;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;

    constructor(email: string, password: string, username: string, description: string) {
        this.email = email;
        this.password = password;
        this.username = username;
        this.description = description;
    }
}
