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
            return response.status(400).json({message: 'User already exists!'})
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

    async changePassword(request: Request, response: Response) {
        const { login, senhaAntiga, novaSenha } = request.body;
        const userRepository = AppDataSource.getRepository(User);

        try {
            // Busca o usuário pelo CPF
            const user = await userRepository.findOne({ where: { login } });

            // Verifica se o usuário existe
            if (!user) {
                return response.status(404).json({ message: "Usuário não encontrado!" });
            }

            // Verifica se a senha antiga está correta
            const senhaCorreta = await compare(senhaAntiga, user.senha);
            if (!senhaCorreta) {
                return response.status(401).json({ message: "Senha antiga inválida!" });
            }

            // Criptografa a nova senha
            const novaSenhaHashed = await hash(novaSenha, 8);

            // Atualiza a senha do usuário no banco de dados
            user.senha = novaSenhaHashed;
            await userRepository.save(user);

            return response.status(200).json({ message: "Senha alterada com sucesso!" });
        } catch (error) {
            console.error("Erro ao alterar a senha:", error);
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    }
}
export default new UserController();
