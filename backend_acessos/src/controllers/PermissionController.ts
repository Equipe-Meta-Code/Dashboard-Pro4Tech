import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import PermissionRepository from "../repositories/PermissionRepository";
import Permission from "../models/Permission";
import { AppDataSource } from "../database/data-source";

class PermissionController {
    async create(request: Request, response: Response) {

        const permissionRepository = AppDataSource.getRepository(Permission); //getCustomRepository(PermissionRepository);

        const { nome_permission, descricao } = request.body;
        
        const existPermission = await permissionRepository.findOneBy({nome_permission});

        if(existPermission) {
            return response.status(400).json({error: "Permission already exists!"});
        }

        const permission = permissionRepository.create({
            nome_permission,
            descricao
        });

        await permissionRepository.save(permission);

        return response.json(permission);
    }
}

export default new PermissionController();