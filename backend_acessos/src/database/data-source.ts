import "reflect-metadata";
import { DataSource } from "typeorm";
import { CreateUsers1713488452253 } from './migrations/1713488452253-CreateUsers';
import User from "../models/User";
import { CreatePermissions1713826201044 } from './migrations/1713826201044-CreatePermissions';
import { CreateRoles1713878406786 } from './migrations/1713878406786-CreateRoles';
import Permission from "../models/Permission";
import Role from "../models/Role";
import { CreatePermissionsRoles1713888292467 } from './migrations/1713888292467-CreatePermissionsRoles';
import { CreateUsersRoles1713912247110 } from './migrations/1713912247110-CreateUsersRoles';
import { CreateProducts1713966819303 } from './migrations/1713966819303-CreateProducts'
import Product from "../models/Product";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "Sintaavibe123**",
    database: "upload",
    synchronize: true,
    logging: false,
    entities: [User, Permission, Role, Product],
    migrations: [CreatePermissions1713826201044, 
        CreateUsers1713488452253, 
        CreateRoles1713878406786,
        CreatePermissionsRoles1713888292467,
        CreateUsersRoles1713912247110,
        CreateProducts1713966819303],
    subscribers: [],
})
