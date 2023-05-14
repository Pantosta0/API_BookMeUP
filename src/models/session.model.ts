import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, ManyToOne } from "typeorm";
import { LectureList } from "./lecture-list.model";
import { Rank } from "./rank.model";
import { User } from "./user.model";

@Entity()
export class Session {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.ranks)
    @JoinColumn()
    user: User;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;

    constructor(user: User) {
        this.user = user;
    }
}
