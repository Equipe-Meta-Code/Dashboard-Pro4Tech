import { Request, Response } from 'express';
import { AppDataSource } from '../database/data-source';
import Comissao from '../models/Comissao';

class ComissaoController {

    async listarComissoes(req: Request, res: Response): Promise<void> {
        try {
            const comissaoRepository = AppDataSource.getRepository(Comissao);

            const comissoes = await comissaoRepository.find({
                select: ['id', 'Vendedor', 'CPF_Vendedor', 'Produto', 'ID_Produto', 'Valor_da_Venda', 'Tipo_de_Venda', 'Porcentagem']
            });

            res.json(comissoes);
        } catch (error) {
            console.error('Erro ao buscar as vendas do vendedor:', error);
            res.status(500).send('Erro ao buscar as vendas do vendedor');
        }
    }
}

export default new ComissaoController();
