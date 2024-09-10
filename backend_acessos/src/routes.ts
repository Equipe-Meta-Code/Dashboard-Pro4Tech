import { Router } from 'express';
import UserController from './controllers/UserController';
import SessionController from './controllers/SessionController';
import PermissionController from './controllers/PermissionController';
import RoleController from './controllers/RoleController';
import ProductController from './controllers/ProductController';
import UploadController from '../src/controllers/UploadController';
import upload from '../src/services/uploadXlsxServices'; 
import InformacoesController from './controllers/InformacoesController';
import VendedorController from './controllers/VendedorController';
import uploadImgUser from '../src/services/uploadImage';
import ClienteController from './controllers/ClienteController';
import ProdutosController from './controllers/ProdutosController';
import ComissaoController from './controllers/ComissaoController';
import { is } from './middlewares/permission';

const router = Router();
//router.post("/users", is(['Admin_Role', 'Admin/Vendedor_Role']), UserController.create);
router.post("/users", UserController.create);
router.post("/sessions", SessionController.create);
router.post("/permissions", PermissionController.create);
router.post("/roles", RoleController.create);

router.get("/users/roles", UserController.roles);
router.put("/updatePassword", UserController.updatePassword);

router.post("/products", is(['Admin_Role']), ProductController.create);
router.get("/products", is(['Admin_Role', 'User_Role']), ProductController.index);
router.get("/products/:id", is(['Admin_Role', 'User_Role']), ProductController.show);

router.post('/upload', upload.single('arquivo'), UploadController.upload);

router.get('/geral', InformacoesController.getInformacoes);
router.put('/vendas_update', InformacoesController.updateVendas);
router.get('/dados_vendas', InformacoesController.getDadosVendas);
router.get('/dados_itens', InformacoesController.getItensMaisVendidos);
router.get('/dados_itens_vendedor', InformacoesController.getItensVendidosPorVendedor);
router.get('/dados_vendas_mensais', InformacoesController.getDadosVendasMensais);
router.get('/dados_vendas_mes', InformacoesController.getDadosVendasMes);
router.get('/dados_vendas_mes_vendedor', InformacoesController.getDadosVendasMesVendedor);
router.get('/dados_vendas_total', InformacoesController.getTotalVendas);
router.get('/dados_vendas_total_user', InformacoesController.getTotalVendasPorUser);
router.post('/vendas_adicionar', InformacoesController.adicionarInformacao);

router.get('/vendedor', VendedorController.getVendedor);
router.get('/vendedores', VendedorController.getVendedores);
router.post('/vendedores_adicionar', VendedorController.adicionarVendedor);
router.put('/vendedores_update', VendedorController.updateVendedores);
router.put('/vendedores_editando', VendedorController.editarVendedor);
router.put('/upload-image', uploadImgUser.single('image'), VendedorController.uploadImage);

router.get('/clientes', ClienteController.listarClientes);
router.put('/vendas_clientes_update', ClienteController.atualizarVendasClientes);
router.post('/clientes_adicionar', ClienteController.adicionarCliente);

router.post('/produto_adicionar', ProdutosController.adicionarProduto);
router.get('/produtos', ProdutosController.listarProdutos);
router.delete('/produtos/:id', ProdutosController.deletarProduto);
router.put('/produtos_update', ProdutosController.atualizarProduto);

router.get('/Comissao', ComissaoController.listarComissoes);

export { router };
