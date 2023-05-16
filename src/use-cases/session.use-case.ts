import { getRepository } from "typeorm";
import { Session } from "../models/session.model";
import { User } from "../models/user.model";
import { isToday, returnDaysBetweenTwoDates, sameDayOfYear } from "../utils/global.util";
import { addSessionRate } from "./user.use-case";

/**
 * creates a new session log for user
 * @param user 
 * @returns 
 */
export async function createSession(user: User): Promise<Session> {
    const sessionRepository = getRepository(Session);
    const sessionEntity = new Session(user);
    const session = await sessionRepository.save(sessionEntity);


    // calculate user rate
    const generatedUserRate = await retrieveUserSessionRate(user.id);
    await addSessionRate(user.id, generatedUserRate);

    return session;

}

/**
 * return all user sessions
 * @param userId 
 * @returns 
 */
export async function getAllUSerSessions(userId: number): Promise<Session[]> {
    const sessionRepository = getRepository(Session);
    return await sessionRepository.find({
        where: { user: { id: userId } }, order: {
            createdAt: "DESC"
        }
    });
}

/**
 * Compara last two sessions (by day difference) to get user rate
 * @param userId 
 */
export async function retrieveUserSessionRate(userId: number): Promise<number> {
    const sessions = await getAllUSerSessions(userId);
    if (sessions.length >= 2) {
        const recent = sessions[0];
        const previous = sessions[1];
        const sameDay = sameDayOfYear(recent.createdAt.toJSON(), previous.createdAt.toJSON());
        if (sameDay) {
            return 0;
        } else {
            const diff = returnDaysBetweenTwoDates(recent.createdAt.toJSON(), previous.createdAt.toJSON());
            return diff;
        }
    } else {
        return 0;
    }
}
