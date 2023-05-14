import { getRepository } from "typeorm";
import { Session } from "../models/session.model";
import { User } from "../models/user.model";

/**
 * creates a new session log for user
 * @param user 
 * @returns 
 */
export async function createSession(user: User): Promise<Session> {
    const sessionRepository = getRepository(Session);
    const sessionEntity = new Session(user);
    const session = await sessionRepository.save(sessionEntity);
    return session;

}

/**
 * return all user sessions
 * @param userId 
 * @returns 
 */
export async function getAllUSerSessions(userId: number): Promise<Session[]> {
    const sessionRepository = getRepository(Session);
    return await sessionRepository.find({ where: { user: { id: userId } } });
}
