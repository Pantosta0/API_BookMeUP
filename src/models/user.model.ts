import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

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

    constructor(email: string, password: string, username: string, description: string) {
        this.email = email;
        this.password = password;
        this.username = username;
        this.description = description;
    }
}
