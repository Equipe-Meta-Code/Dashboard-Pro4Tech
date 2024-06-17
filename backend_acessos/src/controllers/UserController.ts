import { Request, response, Response } from 'express';
import { AppDataSource } from '../database/data-source';
import User from '../models/User';
import { compare, hash } from 'bcryptjs';
import Role from '../models/Role';
import { request } from 'http';
import { decode } from 'jsonwebtoken';

class UserController {

    async create(request: Request, response: Response) {

        const userRepository = AppDataSource.getRepository(User);
        const roleRepository = AppDataSource.getRepository(Role);
        
        console.log('Request received:', request.body);
        const { nome, cpf, login, senha, roles } = request.body;

        const existUser = await userRepository.findOneBy({cpf});

        if(existUser) {
            return response.status(400).json({message: 'Usuário já existente!'})
        }

        //Serve para criptografar a senha do usuário
        const senhaHashed = await hash(senha, 8);

        const existsRoles = await roleRepository.findByIds(roles);

        const user = userRepository.create({
            nome,
            cpf,
            login,
            senha: senhaHashed,
            roles: existsRoles,
        });

        await userRepository.save(user);

        // Criar um novo objeto sem a propriedade senha
        const userResponse = {
            ...user,
            senha: undefined,
        };

        return response.status(201).json(userResponse);
    }


    async roles(request: Request, response: Response) {
        const authHeader = request.headers.authorization || "";
        console.log(authHeader);
        const userRepository = AppDataSource.getRepository(User);

        const [, token] = authHeader?.split(" ");

        try {
            if(!token) {
                return response.status(401).json({ message: "Not authorized!" });
            }

            const payload = decode(token);

            if(!payload) {
                return response.status(401).json({ message: "Not authorized!" });
            }

            const user = await userRepository
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.roles", "roles")
            .where("user.id = :id", { id: payload?.sub })
            .getOne();

            const roles = user?.roles.map((r) => r.nome_role);
            console.log(roles);
            return response.json(roles);
        } catch(err) {
            return response.status(400).send();
        }
    }

    async updatePassword(request: Request, response: Response) {
        const { login, senhaAntiga, novaSenha } = request.body;
    
        const userRepository = AppDataSource.getRepository(User);
    
        try {
            const user = await userRepository.findOne({ where: { login } });
    
            if (!user) {
                return response.status(404).json({ message: 'Usuário não encontrado' });
            }
    
            const senhaMatch = await compare(senhaAntiga, user.senha);
    
            if (!senhaMatch) {
                return response.status(401).json({ message: 'Senha atual incorreta' });
            }
    
            const senhaHashed = await hash(novaSenha, 8);
    
            user.senha = senhaHashed;
    
            await userRepository.save(user);
    
            // Remover a propriedade senha do objeto antes de retornar
            const userResponse = { ...user, senha: undefined };
    
            return response.status(200).json(userResponse);
        } catch (error) {
            return response.status(500).json({ message: 'Erro ao atualizar senha' });
        }
    }
}
export default new UserController();
