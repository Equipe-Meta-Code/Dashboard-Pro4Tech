import { Request, Response } from 'express';
import * as xlsx from 'xlsx';
import path from 'path';
import { AppDataSource } from '../database/data-source';
import Informacoes from '../models/Informacoes';
import Vendedor from '../models/Vendedor';
import Cliente from '../models/Cliente';
import Comissao from '../models/Comissao';
import Produtos from '../models/Produtos';
import { InformacoesData } from '../interface/InformacoesData';
import { VendedorData } from '../interface/VendedorData';
import { ComissaoData } from '../interface/ComissaoData';
import { ProdutosData } from '../interface/ProdutosData';
import { ClienteData } from '../interface/ClienteData';


// Interface combinada para os dados da linha
interface RowData extends InformacoesData, VendedorData, ClienteData, ProdutosData, ComissaoData {}

class UploadController {
    async upload(req: Request, res: Response) {
        // Verifique se o arquivo foi enviado
        if (!req.file) {
            return res.status(400).json({
                error: true,
                message: "Erro: Selecione um arquivo XLSX!"
            });
        }

        try {
            // Caminho para o arquivo XLSX
            const arquivoXLSX = path.resolve(__dirname, '../public/upload/xlsx', req.file.filename);
            const workbook = xlsx.readFile(arquivoXLSX, {
                type: 'array',
                cellDates: true,
                cellNF: false,
                cellText: false
            });

            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json<RowData>(worksheet, { dateNF: "MM/DD/YYYY" });

            const informacoesRepo = AppDataSource.getRepository(Informacoes);
            const vendedorRepo = AppDataSource.getRepository(Vendedor);
            const clienteRepo = AppDataSource.getRepository(Cliente);
            const comissaoRepo = AppDataSource.getRepository(Comissao);
            const produtosRepo = AppDataSource.getRepository(Produtos);

            for (const row of data) {
                const user = await informacoesRepo.findOneBy({ id: row.id });

                if (!user) {
                    const existingVendedor = await vendedorRepo.findOneBy({ Vendedor: row.Vendedor });
                    const existingCliente = await clienteRepo.findOneBy({ Cliente: row.Cliente });
                    const existingProduto = await produtosRepo.findOneBy({ Produto: row.Produto });

                    await informacoesRepo.save(row);

                    if (!existingVendedor) {
                        await vendedorRepo.save({
                            Vendedor: row.Vendedor,
                            CPF_Vendedor: row.CPF_Vendedor,
                        });
                    }
                    if (!existingCliente) {
                        await clienteRepo.save({
                            Cliente: row.Cliente,
                            CNPJ_CPF_Cliente: row.CNPJ_CPF_Cliente,
                            Segmento_do_Cliente: row.Segmento_do_Cliente
                        });
                    }
                    await comissaoRepo.save({
                        Vendedor: row.Vendedor,
                        CPF_Vendedor: row.CPF_Vendedor,
                        Produto: row.Produto,
                        ID_Produto: row.ID_Produto,
                        Valor_da_Venda: row.Valor_da_Venda
                    });
                    if (!existingProduto) {
                        await produtosRepo.save({
                            Produto: row.Produto,
                            Valor_de_Venda: row.Valor_de_Venda
                        });
                    }
                }
            }

            return res.status(200).json({
                error: false,
                message: "Importação concluída."
            });
        } catch (error) {
            console.error("Erro ao importar XLSX:", error);
            return res.status(400).json({
                error: true,
                message: "Erro ao importar XLSX."
            });
        }
    }
}

export default new UploadController();
