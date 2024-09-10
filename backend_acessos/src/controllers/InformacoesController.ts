import { Request, Response } from 'express';
import { AppDataSource } from '../database/data-source';
import Informacoes from '../models/Informacoes';
import moment from 'moment';

// Função para adicionar o tipo de venda a cada linha
const adicionarTipoVenda = (rows: Informacoes[]) => {
    // Agrupar as vendas por produto
    const vendasPorProduto: { [key: string]: Informacoes[] } = {};
    rows.forEach(row => {
        if (!vendasPorProduto[row.Produto]) {
            vendasPorProduto[row.Produto] = [];
        }
        vendasPorProduto[row.Produto].push(row);
    });

    // Iterar sobre as vendas de cada produto e adicionar o tipo de venda do produto
    Object.values(vendasPorProduto).forEach(vendas => {
        const ultimaVenda = vendas[vendas.length - 1]; // Pegar a última venda
        vendas.forEach(venda => {
            venda.tipoVendaProduto = venda === ultimaVenda ? 'Produto Novo' : 'Produto Antigo';
        });
    });

    // Agrupar as vendas por cliente
    const vendasPorCliente: { [key: string]: Informacoes[] } = {};
    rows.forEach(row => {
        if (!vendasPorCliente[row.Cliente]) {
            vendasPorCliente[row.Cliente] = [];
        }
        vendasPorCliente[row.Cliente].push(row);
    });

    // Iterar sobre as vendas de cada cliente e adicionar o tipo de venda do cliente
    Object.values(vendasPorCliente).forEach(vendas => {
        const ultimaVenda = vendas[vendas.length - 1]; // Pegar a última venda
        vendas.forEach(venda => {
            venda.tipoVendaCliente = venda === ultimaVenda ? 'Cliente Novo' : 'Cliente Antigo';
        });
    });
    
    // Adicionar o campo tipoVendaGeral combinando os tipos de venda individuais
    rows.forEach(row => {
        row.tipoVendaGeral = `${row.tipoVendaProduto} - ${row.tipoVendaCliente}`;
    });

    return rows;
};

class InformacoesController {
    
    // Método para buscar todas as informações e adicionar o tipo de venda
    async getInformacoes(req: Request, res: Response) {
        const informacoesRepository = AppDataSource.getRepository(Informacoes);

        try {
            const rows = await informacoesRepository.find();

            // Adiciona o tipo de venda aos dados
            const rowsWithTipoVenda = adicionarTipoVenda(rows);

            // Retorna os dados com o tipo de venda adicionado
            return res.json(rowsWithTipoVenda);
        } catch (error) {
            console.error('Erro ao buscar dados de itens mais vendidos:', error);
            return res.status(500).send('Erro ao buscar dados de itens mais vendidos');
        }
    }

    async updateVendas(req: Request, res: Response) {
        const updatedData = req.body; // Os dados atualizados são enviados no corpo da requisição

        try {
            // Obtém o repositório da entidade `Informacoes`
            const informacoesRepository = AppDataSource.getRepository(Informacoes);

            // Itera sobre os dados atualizados e executa a lógica de atualização
            for (const data of updatedData) {
                await informacoesRepository.update(data.id, {
                    Vendedor: data.Vendedor,
                    CPF_Vendedor: data.CPF_Vendedor,
                    Cliente: data.Cliente,
                    CNPJ_CPF_Cliente: data.CNPJ_CPF_Cliente,
                    Segmento_do_Cliente: data.Segmento_do_Cliente,
                    Valor_de_Venda: data.Valor_de_Venda,
                    Forma_de_Pagamento: data.Forma_de_Pagamento,
                    Produto: data.Produto,
                    ID_Produto: data.ID_Produto
                });
            }

            res.status(200).send('Dados atualizados com sucesso');
        } catch (error) {
            console.error('Erro ao atualizar os dados:', error);
            res.status(500).send('Erro ao atualizar os dados');
        }
    }

    async getDadosVendas(req: Request, res: Response) {
        const startDate = req.query.startDate as string;
        const endDate = req.query.endDate as string;

        try {
            const informacoesRepository = AppDataSource.getRepository(Informacoes);

            // Consulta com filtro de datas
            const vendas = await informacoesRepository
                .createQueryBuilder('informacoes')
                .select('informacoes.Vendedor', 'Vendedor')
                .addSelect('SUM(informacoes.Valor_de_Venda)', 'total_vendas')
                .where('informacoes.Data_da_Venda >= :startDate', { startDate })
                .andWhere('informacoes.Data_da_Venda <= :endDate', { endDate })
                .groupBy('informacoes.Vendedor')
                .getRawMany();

            return res.json(vendas);
        } catch (error) {
            console.error('Erro ao buscar dados de vendas:', error);
            return res.status(500).send('Erro ao buscar dados de vendas');
        }
    }

    async getItensMaisVendidos(req: Request, res: Response) {
        const { startDate, endDate } = req.query;

        try {
            const informacoesRepository = AppDataSource.getRepository(Informacoes);

            // Consulta com filtro de datas, agrupando por Produto e ordenando pela quantidade vendida
            const itensVendidos = await informacoesRepository
                .createQueryBuilder('informacoes')
                .select('informacoes.Produto', 'Produto')
                .addSelect('COUNT(*)', 'quantidade_vendida')
                .where('informacoes.Data_da_Venda >= :startDate', { startDate: new Date(startDate as string) })
                .andWhere('informacoes.Data_da_Venda <= :endDate', { endDate: new Date(endDate as string) })
                .groupBy('informacoes.Produto')
                .orderBy('quantidade_vendida', 'DESC')
                .getRawMany();

            return res.json(itensVendidos);
        } catch (error) {
            console.error('Erro ao buscar dados de itens mais vendidos:', error);
            return res.status(500).send('Erro ao buscar dados de itens mais vendidos');
        }
    }

    async getItensVendidosPorVendedor(req: Request, res: Response) {
        try {
            const { vendedor, startDate, endDate } = req.query;

            if (!vendedor || !startDate || !endDate) {
                return res.status(400).send('Parâmetros incompletos');
            }
            const informacoesRepository = AppDataSource.getRepository(Informacoes);

            // Realiza de CPF_Vendedor, Data_da_Venda, e agrupamento por Produto
            const itensVendidos = await informacoesRepository
                .createQueryBuilder('informacoes')
                .select('informacoes.Produto', 'Produto')
                .addSelect('COUNT(*)', 'quantidade_vendida')
                .where('informacoes.CPF_Vendedor = :vendedor', { vendedor: vendedor })
                .andWhere('informacoes.Data_da_Venda >= :startDate', { startDate: new Date(startDate as string) })
                .andWhere('informacoes.Data_da_Venda <= :endDate', { endDate: new Date(endDate as string) })
                .groupBy('informacoes.Produto')
                .orderBy('quantidade_vendida', 'DESC')
                .getRawMany();

            return res.json(itensVendidos);
        } catch (error) {
            console.error('Erro ao buscar os itens mais vendidos por vendedor:', error);
            return res.status(500).send('Erro ao buscar os itens mais vendidos por vendedor');
        }
    }

    async getDadosVendasMensais(req: Request, res: Response) {
        try {
            const startDate = req.query.startDate as string;
            const endDate = req.query.endDate as string;

            if (!startDate || !endDate) {
                return res.status(400).send('Os parâmetros startDate e endDate são obrigatórios');
            }
            const informacoesRepository = AppDataSource.getRepository(Informacoes);

            const data = await informacoesRepository
                .createQueryBuilder('informacoes')
                .select('EXTRACT(MONTH FROM informacoes.Data_da_Venda) AS mes')
                .addSelect('informacoes.Produto', 'Produto')
                .addSelect('COUNT(informacoes.ID_Produto)', 'quantidade_vendida')
                .addSelect('SUM(informacoes.Valor_de_Venda)', 'total_vendas')
                .where('informacoes.Data_da_Venda BETWEEN :startDate AND :endDate', { startDate, endDate })
                .groupBy('mes, Produto')
                .getRawMany();

            // Reformatando os dados para o frontend
            const formattedData = data.reduce((acc: any, row: any) => {
                const month = row.mes;
                const product = row.Produto;
                const sales = parseFloat(row.total_vendas);

                if (!acc[month]) {
                    acc[month] = { mes: month, produtos: {} };
                }

                acc[month].produtos[product] = sales;
                return acc;
            }, {});

            res.json(Object.values(formattedData));
        } catch (error) {
            console.error('Erro ao buscar dados de vendas mensais:', error);
            res.status(500).send('Erro ao buscar dados de vendas mensais');
        }
    }

    async getDadosVendasMes(req: Request, res: Response) {
        try {
            const startDate = req.query.startDate as string;
            const endDate = req.query.endDate as string;

            if (!startDate || !endDate) {
                return res.status(400).send('Os parâmetros startDate e endDate são obrigatórios');
            }

            const informacoesRepository = AppDataSource.getRepository(Informacoes);

            const data = await informacoesRepository
                .createQueryBuilder('informacoes')
                .select('EXTRACT(MONTH FROM informacoes.Data_da_Venda) AS mes')
                .addSelect('SUM(informacoes.Valor_de_Venda)', 'total_vendas')
                .where('informacoes.Data_da_Venda BETWEEN :startDate AND :endDate', { startDate, endDate })
                .groupBy('mes')
                .getRawMany();

            res.json(data);
        } catch (error) {
            console.error('Erro ao buscar dados de vendas por mês:', error);
            res.status(500).send('Erro ao buscar dados de vendas por mês');
        }
    }

    async getDadosVendasMesVendedor(req: Request, res: Response) {
        try {
            const { vendedor, startDate, endDate } = req.query;
            
            if (!vendedor || !startDate || !endDate) {
                return res.status(400).send('Parâmetros incompletos');
            }
            const informacoesRepository = AppDataSource.getRepository(Informacoes);
            
            const data = await informacoesRepository
                .createQueryBuilder('informacoes')
                .select('EXTRACT(MONTH FROM informacoes.Data_da_Venda) AS mes')
                .addSelect('SUM(informacoes.Valor_de_Venda)', 'total_vendas')
                .where('informacoes.CPF_Vendedor = :vendedor AND informacoes.Data_da_Venda BETWEEN :startDate AND :endDate', 
                       { vendedor, startDate, endDate })
                .groupBy('mes')
                .getRawMany();
            
            res.json(data);
        } catch (error) {
            console.error('Erro ao buscar as vendas por mês para o vendedor:', error);
            res.status(500).send('Erro ao buscar as vendas por mês para o vendedor');
        }
    }

    async getTotalVendas(req: Request, res: Response): Promise<void> {
        try {
          const { startDate, endDate } = req.query;
          
          if (!startDate || !endDate) {
            res.status(400).send('Os parâmetros startDate e endDate são obrigatórios');
            return;
          }
          const informacoesRepository = AppDataSource.getRepository(Informacoes);
          
          const result = await informacoesRepository
            .createQueryBuilder('informacoes')
            .select('SUM(informacoes.Valor_de_Venda)', 'total_vendas')
            .where('informacoes.Data_da_Venda BETWEEN :startDate AND :endDate', { startDate, endDate })
            .getRawOne();
            
          res.json(result);
        } catch (error) {
          console.error('Erro ao buscar dados de vendas:', error);
          res.status(500).send('Erro ao buscar dados de vendas');
        }
    }

      async getTotalVendasPorUser(req: Request, res: Response): Promise<void> {
        try {
          const { vendedor, startDate, endDate } = req.query;
          
          if (!vendedor || !startDate || !endDate) {
            res.status(400).send('Parâmetros incompletos');
            return;
          }
          
          const informacoesRepository = AppDataSource.getRepository(Informacoes);
          
          const result = await informacoesRepository
            .createQueryBuilder('informacoes')
            .select('SUM(informacoes.Valor_de_Venda)', 'total_vendas')
            .where('informacoes.CPF_Vendedor = :vendedor AND informacoes.Data_da_Venda BETWEEN :startDate AND :endDate', { vendedor, startDate, endDate })
            .getRawOne();
            
          res.json(result);
        } catch (error) {
          console.error('Erro ao buscar dados de vendas:', error);
          res.status(500).send('Erro ao buscar dados de vendas');
        }
    }

    async adicionarInformacao(req: Request, res: Response): Promise<void> {
        const newData = req.body;

        try {
            const now = moment().format('YYYY-MM-DD HH:mm:ss');

            newData.createdAt = now;
            newData.updatedAt = now;

            const informacoesRepository = AppDataSource.getRepository(Informacoes);

            const informacao = informacoesRepository.create(newData);

            await informacoesRepository.save(informacao);

            res.status(200).send('Dados adicionados com sucesso');
        } catch (error) {
            console.error('Erro ao adicionar a informação:', error);
            res.status(500).send('Erro ao adicionar a informação');
        }
    }
}

export default new InformacoesController();
