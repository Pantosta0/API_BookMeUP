import { getRepository } from "typeorm";
import { Book } from "../models/book.model";
import { User } from "../models/user.model";
import { Rank } from "../models/rank.model";
import { getUserById } from "./user.use-case";

export type rankUpdateInput = {
    score?: number;
}

export async function createRank(score: number, user: User, book: Book): Promise<User> {
    const rankRepository = getRepository(Rank);
    const userRepository = getRepository(User);
    let rank = new Rank(score, <User>user, <Book>book);
    await rankRepository.save(rank);
    const saved = await getUserById(user.id);
    return saved!;
}

export async function getRankByUserAndBok(userId: number, bookId: number): Promise<Rank | undefined> {
    const rankRepository = getRepository(Rank);
    const foundRank = await rankRepository.findOne({
        where: {
            user: {
                id: userId
            },
            book: {
                id: bookId
            }
        }
    });
    return foundRank;
}

export async function updateRank(id: number, data: rankUpdateInput): Promise<void> {
    const rankRepository = getRepository(Rank);
    let foundRank = await rankRepository.findOne(id);
    if (data.score !== undefined) {
        foundRank!.score = data.score;
    }
    await rankRepository.save(<Rank>foundRank);
}