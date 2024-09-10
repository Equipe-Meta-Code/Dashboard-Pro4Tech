import { Request, Response } from 'express';
import { AppDataSource } from '../database/data-source';
import Produtos from '../models/Produtos';
import Informacoes from '../models/Informacoes';

class ProdutosController {
    async adicionarProduto(req: Request, res: Response) {
        const newData = req.body;

        try {
            const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

            const produtoData = {
                ...newData,
                createdAt: now,
                updatedAt: now,
            };

            const produtosRepository = AppDataSource.getRepository(Produtos);
            
            await produtosRepository.save(produtoData);

            res.status(200).send('Produto adicionado com sucesso');
        } catch (error) {
            console.error('Erro ao adicionar o produto:', error);
            res.status(500).send('Erro ao adicionar o produto');
        }
    }

    async listarProdutos(req: Request, res: Response): Promise<void> {
        try {
            const produtosRepository = AppDataSource.getRepository(Produtos);

            const produtos = await produtosRepository.find({
                select: ['id', 'Produto', 'Valor_de_Venda']
            });

            res.json(produtos);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            res.status(500).send('Erro ao buscar produtos');
        }
    }

    async deletarProduto(req: Request, res: Response): Promise<void> {
        const produtoId = parseInt(req.params.id);

        try {
            const produtosRepository = AppDataSource.getRepository(Produtos);

            const produto = await produtosRepository.findOneBy({ id: produtoId });
            if (!produto) {
                res.status(404).send('Produto não encontrado');
                return
            }

            await produtosRepository.delete(produtoId);

            res.status(200).send('Produto deletado com sucesso');
        } catch (error) {
            console.error('Erro ao deletar o produto:', error);
            res.status(500).send('Erro ao deletar o produto');
        }
    }

    async atualizarProduto(req: Request, res: Response): Promise<void> {
        const updatedData = req.body;

        if (!Array.isArray(updatedData)) {
            console.error('Erro ao atualizar os dados: updatedData não é um array');
            res.status(400).send('Dados inválidos');
            return;
        }

        try {
            const informacoesRepository = AppDataSource.getRepository(Informacoes);
            const produtosRepository = AppDataSource.getRepository(Produtos);

            for (const data of updatedData) {
                await informacoesRepository.update({ ID_Produto: data.id }, {
                    Produto: data.Produto,
                    Valor_de_Venda: data.Valor_de_Venda
                });

                await produtosRepository.update({ id: data.id }, {
                    Produto: data.Produto,
                    Valor_de_Venda: data.Valor_de_Venda
                });
            }

            res.status(200).send('Dados atualizados com sucesso');
        } catch (error) {
            console.error('Erro ao atualizar os dados:', error);
            res.status(500).send('Erro ao atualizar os dados');
        }
    }
};

export default new ProdutosController;
