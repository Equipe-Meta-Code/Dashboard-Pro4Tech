import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import UserRepository from "../repositories/UserRepository";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { AppDataSource } from "../database/data-source";
import User from "../models/User";

class SessionController {

    async create(request: Request, response: Response) {

        const { login , senha } = request.body;

        const userRepository = AppDataSource.getRepository(User); 
        

        const user = await userRepository.findOneBy({login});

        if(!user) {
            return response.status(400).json({error: "User not found!"});
        }

        const matchSenha = await compare(senha, user.senha);

        if(!matchSenha) {
            return response.status(400).json({error: "Incorrect login or password!"})
        }

        
        const token = sign({}, "7243660f79803bd3ff08830304134d4f", {
            subject: user.id.toString(),
            expiresIn: "1d",
        });

        return response.json({
            token, 
            user,
        });
    }
}

export default new SessionController;