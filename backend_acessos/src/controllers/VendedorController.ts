import { Request, Response } from 'express';
import { AppDataSource } from '../database/data-source';
import Vendedor from '../models/Vendedor';
import Informacoes from '../models/Informacoes';

const adicionarTipoVenda = (vendedores: Vendedor[]): Vendedor[] => {
    const vendasPorProduto: { [key: string]: Vendedor[] } = {};
    vendedores.forEach(vendedor => {
        if (!vendasPorProduto[vendedor.Produto]) {
            vendasPorProduto[vendedor.Produto] = [];
        }
        vendasPorProduto[vendedor.Produto].push(vendedor);
    });

    // Iterar sobre as vendas de cada produto e adicionar o tipo de venda do produto
    Object.values(vendasPorProduto).forEach(vendas => {
        const ultimaVenda = vendas[vendas.length - 1];
        vendas.forEach(venda => {
            venda.tipoVendaProduto = venda === ultimaVenda ? 'Produto Novo' : 'Produto Antigo';
        });
    });

    // Agrupar as vendas por cliente
    const vendasPorCliente: { [key: string]: Vendedor[] } = {};
    vendedores.forEach(vendedor => {
        if (!vendasPorCliente[vendedor.Cliente]) {
            vendasPorCliente[vendedor.Cliente] = [];
        }
        vendasPorCliente[vendedor.Cliente].push(vendedor);
    });

    // Iterar sobre as vendas de cada cliente e adicionar o tipo de venda do cliente
    Object.values(vendasPorCliente).forEach(vendas => {
        const ultimaVenda = vendas[vendas.length - 1];
        vendas.forEach(venda => {
            venda.tipoVendaCliente = venda === ultimaVenda ? 'Cliente Novo' : 'Cliente Antigo';
        });
    });

    // Adicionar o campo tipoVendaGeral combinando os tipos de venda individuais
    vendedores.forEach(vendedor => {
        vendedor.tipoVendaGeral = `${vendedor.tipoVendaProduto} - ${vendedor.tipoVendaCliente}`;
    });

    return vendedores;
}

class VendedorController {

    async getVendedor(req: Request, res: Response) {
        try {
            const { vendedor } = req.query;

            if (!vendedor) {
                return res.status(400).send('Parâmetros incompletos');
            }
            const vendedorRepository = AppDataSource.getRepository(Vendedor);

            // Realiza a consulta com filtro pelo ID do vendedor
            const vendedorData = await vendedorRepository
                .createQueryBuilder('vendedor')
                .select(['vendedor.Vendedor', 'vendedor.CPF_Vendedor', 'vendedor.Email', 'vendedor.Telefone', 'vendedor.Endereco', 'vendedor.Pais', 'vendedor.Data_Nascimento', 'vendedor.foto'])
                .where('vendedor.id = :id', { id: vendedor })
                .getOne();

            if (!vendedorData) {
                return res.status(404).send('Vendedor não encontrado');
            }

            return res.json(vendedorData);
        } catch (error) {
            console.error('Erro ao buscar dados do vendedor:', error);
            return res.status(500).send('Erro ao buscar dados do vendedor');
        }
    }

    async getVendedores(req: Request, res: Response): Promise<void> {
        try {
            const vendedorRepository = AppDataSource.getRepository(Vendedor);

            const vendedores = await vendedorRepository.find();

            const vendedoresComTipoVenda = adicionarTipoVenda(vendedores);

            res.json(vendedoresComTipoVenda);
        } catch (error) {
            console.error('Erro ao buscar dados de vendedores:', error);
            res.status(500).send('Erro ao buscar dados de vendedores');
        }
    }

    async adicionarVendedor(req: Request, res: Response): Promise<void> {
        const newData = req.body;

        try {
            const now = new Date(); // Obtém a data e hora atuais

            // Adiciona createdAt e updatedAt aos dados recebidos
            newData.createdAt = now;
            newData.updatedAt = now;

            const vendedorRepository = AppDataSource.getRepository(Vendedor);

            // Cria uma nova instância de Vendedor com os dados recebidos
            const vendedor = vendedorRepository.create(newData);

            await vendedorRepository.save(vendedor);

            res.status(200).send('Dados atualizados com sucesso');
        } catch (error) {
            console.error('Erro ao atualizar os dados:', error);
            res.status(500).send('Erro ao atualizar os dados');
        }
    }

    async updateVendedores(req: Request, res: Response): Promise<void> {
        const updatedData = req.body; // Os dados atualizados são enviados no corpo da requisição

        try {
            const vendedorRepository = AppDataSource.getRepository(Vendedor);
            const informacoesRepository = AppDataSource.getRepository(Informacoes);

            // Atualiza os dados na tabela vendedor
            for (const data of updatedData) {
                // Atualiza vendedor
                const vendedor = await vendedorRepository.findOneBy({ id: data.id });

                if (vendedor) {
                    vendedor.Vendedor = data.Vendedor;
                    vendedor.CPF_Vendedor = data.CPF_Vendedor;
                    vendedor.Email = data.Email;
                    vendedor.Telefone = data.Telefone;
                    vendedor.Endereco = data.Endereco;
                    vendedor.Pais = data.Pais;
                    vendedor.Data_Nascimento = data.Data_Nascimento;
                    vendedor.foto = data.foto;

                    await vendedorRepository.save(vendedor);

                    // Atualiza a tabela 'informacoes'
                    await informacoesRepository.update(
                        { CPF_Vendedor: data.CPF_Vendedor },
                        {
                            Vendedor: data.Vendedor,
                            CPF_Vendedor: data.CPF_Vendedor
                        }
                    );
                } else {
                    console.log(`Vendedor com ID ${data.id} não encontrado.`);
                }
            }

            res.status(200).send('Dados atualizados com sucesso');
        } catch (error) {
            console.error('Erro ao atualizar os dados:', error);
            res.status(500).send('Erro ao atualizar os dados');
        }
    }

    async editarVendedor(req: Request, res: Response): Promise<void> {
        const updatedData = req.body;

        try {
            if (!updatedData.Vendedor || !updatedData.CPF_Vendedor) {
                res.status(400).send('Dados inválidos');
                return;
            }

            const vendedorRepository = AppDataSource.getRepository(Vendedor);
            const informacoesRepository = AppDataSource.getRepository(Informacoes);

            // Atualização no banco de dados
            await vendedorRepository.update(
                { CPF_Vendedor: updatedData.CPF_Vendedor },
                {
                    Vendedor: updatedData.Vendedor,
                    Email: updatedData.Email,
                    Telefone: updatedData.Telefone,
                    Endereco: updatedData.Endereco,
                    Pais: updatedData.Pais
                }
            );

            await informacoesRepository.update(
                { CPF_Vendedor: updatedData.CPF_Vendedor },
                {
                    Vendedor: updatedData.Vendedor
                }
            );
            res.status(200).send('Dados atualizados com sucesso');
        } catch (error) {
            console.error('Erro ao atualizar os dados:', error);
            res.status(500).send('Erro ao atualizar os dados');
        }
    }

    async uploadImage(req: Request, res: Response): Promise<Response> {
        const updatedData = req.body;

        console.log('Recebido pedido de upload de imagem');

        if (!req.file) {
            console.error('Nenhum arquivo foi enviado');
            return res.status(400).json({
                erro: true,
                message: 'Erro: Selecione uma imagem válida JPEG ou PNG!'
            });
        }

        console.log('Nome:', req.file.filename);
        console.log('id', updatedData.id);

        try {
            const vendedorRepository = AppDataSource.getRepository(Vendedor);

            await vendedorRepository.update(
                { id: updatedData.id },
                { foto: req.file.filename }
            );

            return res.status(200).json({
                success: true,
                message: 'Imagem atualizada com sucesso'
            });
        } catch (error) {
            console.error('Erro ao atualizar a imagem:', error);
            return res.status(500).json({
                erro: true,
                message: 'Erro ao atualizar a imagem'
            });
        }
    }
    
}

export default new VendedorController();
