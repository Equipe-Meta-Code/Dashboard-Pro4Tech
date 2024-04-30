import { Request, Response } from "express";
import Role from "../models/Role";
import { AppDataSource } from "../database/data-source";
import Permission from "../models/Permission";

class RoleController {
    async create(request: Request, response: Response) {

        const roleRepository = AppDataSource.getRepository(Role); 
        const permissionRepository = AppDataSource.getRepository(Permission); 

        const { nome_role, descricao, permissions } = request.body;
        
        const existRole = await roleRepository.findOneBy({ nome_role });

        if(existRole) {
            return response.status(400).json({error: "Role already exists!"});
        }

        const existsPermissions = await permissionRepository.findByIds(permissions);

        const role = roleRepository.create({
            nome_role,
            descricao,
            permission: existsPermissions,
        });

        await roleRepository.save(role);

        return response.json(role);
    }
}

export default new RoleController();