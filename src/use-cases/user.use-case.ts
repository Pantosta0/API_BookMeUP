import { Like, getRepository } from "typeorm";
import { User } from "../models/user.model"
import { hashPassword } from "../utils/global.util";
import { LectureList } from "../models/lecture-list.model";
import { Book } from "../models/book.model";
import { generateAvatarLink } from "../utils/user.utils";

export async function getAllUsers(where?: { username: string; }): Promise<User[]> {
    const userRepository = getRepository(User);
    const users = await userRepository.find({ where });
    return users;
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
        relations: ['readingList', 'readingList.books', 'sessions'],
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

export async function getUserById(id: number): Promise<User | undefined> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne(id, { relations: ['readingList', 'readingList.books', 'ranks', 'ranks.book', 'friends'] });
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

export async function addLectureToUser(userData: User, bookData: Book): Promise<User> {
    const userRepository = getRepository(User);
    const lectureRepository = getRepository(LectureList);
    let user = <User>userData;
    let book = <Book>bookData;
    let lecture = await lectureRepository.findOne(user.readingList?.id, { relations: ["user", "books"] });


    if (lecture!.books!.length == 0) {
        lecture!.books!.push(book);
    } else {
        lecture!.books! = lecture!.books!.concat([book]);
    }

    lecture = await lectureRepository.save(lecture!);
    const saved = await getUserById(user.id);
    return saved!;
}

export async function createUser(data: { email: string, password: string, username: string, description: string, gender: string, avatarUrl?: string }): Promise<User> {

    let avatar = "https://cdn-icons-png.flaticon.com/512/1/1247.png";

    data.password = await hashPassword(data.password);
    data.email = data.email.toLowerCase();
    data.username = data.username.toLowerCase();

    data.gender = data.gender.toUpperCase();

    if (data.gender == "M") {
        data.avatarUrl = await generateAvatarLink("male");
    } else if (data.gender == "F") {
        data.avatarUrl = await generateAvatarLink("female");
    } else {
        data.avatarUrl = avatar;
    }

    const userRepository = getRepository(User);
    const lectureListRepository = getRepository(LectureList);


    let userEntity = <User>data;
    let user = await userRepository.save(userEntity);

    let lectureListEntity = new LectureList(userEntity, []);
    await lectureListRepository.save(lectureListEntity);

    let saved = await userRepository.findOne(user.id, { relations: ["readingList"] });
    return saved!;
}

export async function addSessionRate(id: number, rateGenerated: number) {
    const userRepository = getRepository(User);
    let user = await getUserById(id);
    const { rate } = user!;
    if (rateGenerated == 1) {
        user!.rate = user!.rate + 1;
    } else if (rateGenerated > 1) {
        let newRate = rate - rateGenerated
        if (newRate <= 0) {
            newRate = 0;
        }
        user!.rate = newRate;
    }
    await userRepository.save(user!);
}

export async function getUserByUsernameLike(username: string): Promise<User[]> {
    const userRepository = getRepository(User);
    const user = await userRepository.find({
        where: {
            username: Like(`%${username}%`)
        },
        relations: ['readingList', 'readingList.books', 'ranks', 'ranks.book', 'friends']
    });
    return user;
}

export async function addFriend(id: number, friendId: number): Promise<User> {
    const userRepository = getRepository(User);
    let user = await getUserById(id);
    let friend = await getUserById(friendId);

    user!.friends = user!.friends.concat([friend!]) || [friend!];

    return await userRepository.save(user!);
}


export async function removeFriend(id: number, friendId: number): Promise<User> {
    const userRepository = getRepository(User);
    let user = await getUserById(id);
    let friend = await getUserById(friendId);

    user!.friends = user!.friends.filter(el => el.id !== friend?.id);

    return await userRepository.save(user!);
}