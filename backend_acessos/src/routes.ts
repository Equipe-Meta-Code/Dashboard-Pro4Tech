import { Router } from 'express';
import UserController from './controllers/UserController';
import SessionController from './controllers/SessionController';
import PermissionController from './controllers/PermissionController';
import RoleController from './controllers/RoleController';
import ProductController from './controllers/ProductController';

import { is } from './middlewares/permission';

const router = Router();

router.post("/users", is(['Admin_Role', 'Admin/Vendedor_Role']), UserController.create);
router.post("/sessions", SessionController.create);
router.post("/permissions", PermissionController.create);
router.post("/roles", RoleController.create);

router.get("/users/roles", UserController.roles);

router.post("/products", is(['Admin_Role']), ProductController.create);
router.get("/products", is(['Admin_Role', 'User_Role']), ProductController.index);
router.get("/products/:id", is(['Admin_Role', 'User_Role']), ProductController.show);

router.put("/updatePassword", UserController.updatePassword);

export { router };
