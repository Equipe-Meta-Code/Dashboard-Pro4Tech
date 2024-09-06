import "reflect-metadata";
import { DataSource } from "typeorm";
import User from "../models/User";
import Permission from "../models/Permission";
import Role from "../models/Role";
import Product from "../models/Product";
import { CreateUsers1713488452253 } from './migrations/1713488452253-CreateUsers';
import { CreatePermissions1713826201044 } from './migrations/1713826201044-CreatePermissions';
import { CreateRoles1713878406786 } from './migrations/1713878406786-CreateRoles';
import { CreatePermissionsRoles1713888292467 } from './migrations/1713888292467-CreatePermissionsRoles';
import { CreateUsersRoles1713912247110 } from './migrations/1713912247110-CreateUsersRoles';
import { CreateProducts1713966819303 } from './migrations/1713966819303-CreateProducts';
import { CreateInformacoes1725635335401 } from './migrations/1725635335401-CreateInformacoes';
import { CreateCliente1725636888704 } from './migrations/1725636888704-CreateCliente';
import { CreateComissao1725646611269 } from './migrations/1725646611269-CreateComissao';
import { CreateProdutos1725647497765 } from './migrations/1725647497765-CreateProdutos';
import { CreatePorcentagem1725647023777 } from './migrations/1725647023777-CreatePorcentagem';
import { CreateVendedor1725647218438 } from './migrations/1725647218438-CreateVendedor';

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "upload",
    synchronize: true,
    logging: false,
    entities: [User, Permission, Role, Product],
    migrations: [CreatePermissions1713826201044, 
        CreateUsers1713488452253, 
        CreateRoles1713878406786,
        CreatePermissionsRoles1713888292467,
        CreateUsersRoles1713912247110,
        CreateProducts1713966819303,
        CreateInformacoes1725635335401,
        CreateCliente1725636888704,
        CreateComissao1725646611269,
        CreateProdutos1725647497765,
        CreatePorcentagem1725647023777,
        CreateVendedor1725647218438],
    subscribers: [],
})
