import { getRepository } from "typeorm";
import { User } from "../models/user.model"
import { hashPassword } from "../utils/global.util";
import { LectureList } from "../models/lecture-list.model";

export async function getAllUsers(where?: { username: string; }): Promise<User[]> {
    const userRepository = getRepository(User);
    const users = await userRepository.find({ where });
    return users;
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
        relations: ["readingList", "readingList.books"],
        where: {
            email: email.toLowerCase()
        },
    });
    return user;
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
        where: {
            username
        },
    });
    return user;
}

export async function getUserByEmailOrUsername(email: string, username: string): Promise<User | undefined> {
    const userRepository = getRepository(User);
    const user = await userRepository
        .createQueryBuilder('user')
        .where('user.email = :email OR user.username = :username', { email, username })
        .getOne();
    return user;
}

export async function createUser(data: {
    email: string, password: string, username: string, description: string
}): Promise<User> {
    data.password = await hashPassword(data.password);
    data.email = data.email.toLowerCase();
    data.username = data.username.toLowerCase();
    const userRepository = getRepository(User);
    const lectureListRepository = getRepository(LectureList);
    let userEntity = <User>data;
    let user = await userRepository.save(userEntity);
    let lectureListEntity = new LectureList(userEntity, []);
    await lectureListRepository.save(lectureListEntity);
    let saved = await userRepository.findOne(user.id, { relations: ["readingList"] });
    return saved!;
}