import { Request, Response } from 'express';
import { AppDataSource } from '../database/data-source';
import Cliente from '../models/Cliente'; 
import Informacoes from '../models/Informacoes';
import moment from 'moment';

class ClienteController {
    async listarClientes(req: Request, res: Response) {
        try {
            const clienteRepository = AppDataSource.getRepository(Cliente);

            // Buscar todos os clientes
            const clientes = await clienteRepository.find({
                select: ['id', 'Cliente', 'CNPJ_CPF_Cliente', 'Segmento_do_Cliente'],
            });

            res.json(clientes);
        } catch (error) {
            console.error('Erro ao buscar dados de clientes:', error);
            res.status(500).json({
                erro: true,
                message: 'Erro ao buscar dados de clientes',
            });
        }
    }

    async atualizarVendasClientes(req: Request, res: Response) {
        const updatedData = req.body;

        try {
            const clienteRepository = AppDataSource.getRepository(Cliente);
            const informacoesRepository = AppDataSource.getRepository(Informacoes);

            for (const data of updatedData) {
                await informacoesRepository.update(
                    { CNPJ_CPF_Cliente: data.CNPJ_CPF_Cliente },
                    { Cliente: data.Cliente, Segmento_do_Cliente: data.Segmento_do_Cliente }
                );

                await clienteRepository.update(
                    { CNPJ_CPF_Cliente: data.CNPJ_CPF_Cliente },
                    { Cliente: data.Cliente, Segmento_do_Cliente: data.Segmento_do_Cliente }
                );
            }

            res.status(200).send('Dados atualizados com sucesso');
        } catch (error) {
            console.error('Erro ao atualizar os dados:', error);
            res.status(500).send('Erro ao atualizar os dados');
        }
    }

    async adicionarCliente(req: Request, res: Response) {
        const newData = req.body;
        try {
            const now = moment().format('YYYY-MM-DD HH:mm:ss'); 

            const clienteData = {
                ...newData,
                createdAt: now,
                updatedAt: now,
            };

            const clienteRepository = AppDataSource.getRepository(Cliente);
            
            await clienteRepository.save(clienteData);

            res.status(200).send('Dados adicionados com sucesso');
        } catch (error) {
            console.error('Erro ao adicionar os dados:', error);
            res.status(500).send('Erro ao adicionar os dados');
        }
    }
};

export default new ClienteController;
