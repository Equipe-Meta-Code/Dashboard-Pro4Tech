import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import User from "../models/User";
import { decode } from "jsonwebtoken";
import { request } from "http";

async function decoder(request: Request): Promise<User | undefined> {
    const authHeader = request.headers.authorization || "";

    const userRepository = AppDataSource.getRepository(User);

    const [ , token] = authHeader?.split(" ");

    const payload = decode(token);

    const user = await userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.roles", "roles")
        .where("user.id = :id", { id: payload?.sub })
        .getOne();

    return user || undefined; 
}

function is(role: String[]) {
    const roleAuthorized = async(
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const user = await decoder(request);

        const userRoles = user?.roles.map(role => role.nome_role);

        const existsRoles = userRoles?.some(r => role.includes(r));

        if(existsRoles) {
            return next();
        }

        return response.status(401).json({message: "Not authorized!"});
    };

    return roleAuthorized;
}

export { is };