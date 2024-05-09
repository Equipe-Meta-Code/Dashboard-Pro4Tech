// Incluir as bibliotecas
//Gerencia as requisições, rotas e URLs, entre outras funcionalidades
const express = require('express');
//Incluir biblioteca para ler o conteúdo do arquivo xlsx
const xlsx = require('xlsx');
//Importar a biblioteca para permitir conexão externa
const cors = require('cors');
//Permite interagir com o sistema de arquivos
const fs = require('fs');
//Incluir o módulo para gerenciar diretórios e caminhos
const path = require('path');
//Incluir o arquivo com a função de upload
const upload = require('./services/uploadXlsxServices');
//Incluir a conexão com banco de dados
const db = require('./db/models');
//Chamar a função express
const app = express();

const mysql = require('mysql2/promise');

// Criar o middleware para receber os dados no corpo da requisição
app.use(express.json());

//Criar o middleware para permitir requisição externa
app.use((req, res, next) => {

    //Qualquer endereço pode fazer requisição "*"
    res.header("Access-Control-Allow-Origin", "*");

    //Tipos de métodos que a API aceita
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");

    //Permitir o envio de dados para API
    res.header("Access-Control-Allow-Headers", "Content-Type");

    //Executar o cors
    app.use(cors());

    //Quando não houver erro deve continuar o processamento
    next();
});

// Local dos arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Criar a rota importar XLSX
app.post("/", upload.single('arquivo'), async (req, res) => {

    // Acessa o IF quando não há arquivo enviado
    if (!req.file) {
        return res.status(400).json({
            error: true,
            message: "Erro: Selecione um arquivo XLSX!"
        });
    }

    try {
        // Caminho para o arquivo XLSX
        const arquivoXLSX = './public/upload/xlsx/' + req.file.filename;

        // Ler o arquivo XLSX
        const workbook = xlsx.readFile(arquivoXLSX, {
            type: 'array',
            cellDates: true,
            cellNF: false,
            cellText: false
        });

        // Obter a primeira planilha
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Converter a planilha em um array de objetos JavaScript
        const data = xlsx.utils.sheet_to_json(worksheet,{dateNF:"MM/DD/YYYY"});

        // Salvar os dados no banco de dados
        for (const row of data) {
            const user = await db.Informacoes.findOne({
               where: { id: row.id}
            });

            if (!user) {
                const existingVendedor = await db.Vendedor.findOne({
                    where: { Vendedor: row.Vendedor }
                });
                const existingProduto = await db.Informacoes.findOne({
                    where: { Produto: row.Produto }
                });

                await db.Informacoes.create(row);
                // Insere os dados na tabela Vendedor
                if (!existingVendedor) {
                    console.log("Data de venda da linha:", row.Data_da_Venda);
                    // Se o vendedor não existir, cria um novo registro na tabela Vendedor
                    await db.Vendedor.create({
                        Vendedor: row.Vendedor,
                        CPF_Vendedor: row.CPF_Vendedor,
                        Data_da_Venda: row.Data_da_Venda, // Certifique-se de que a propriedade correta está sendo acessada aqui
                        Valor_de_Venda: row.Valor_de_Venda
                    });
                }
                await db.Cliente.create({
                    Cliente: row.Cliente,
                    CNPJ_CPF_Cliente: row.CNPJ_CPF_Cliente
                });   
                await db.Comissao.create({
                    Vendedor: row.Vendedor,
                    CPF_Vendedor: row.CPF_Vendedor,
                    Produto: row.Produto,
                    ID_Produto: row.ID_Produto,
                    Valor_da_Venda: row.Valor_de_Venda
                });
            }
        }

        return res.status(200).json({
            error: false,
            message: "Importação concluída."
        });
    } catch (error) {
        return res.status(400).json({
            error: true,
            message: "Erro ao importar XLSX."
        });
    }
});

// Função para adicionar o tipo de venda a cada linha
const adicionarTipoVenda = (rows) => {
    // Agrupar as vendas por produto
    const vendasPorProduto = {};
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
    const vendasPorCliente = {};
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

// Exportar dados para rota em JSON
async function exportar() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_BASE
        });

        app.get('/geral', async (req, res) => {
            try {
                const [rows, fields] = await connection.query('SELECT * FROM informacoes');
                const rowsWithTipoVenda = adicionarTipoVenda(rows);
                res.json(rowsWithTipoVenda);
            } catch (error) {
                console.error('Erro ao buscar dados de itens mais vendidos:', error);
                res.status(500).send('Erro ao buscar dados de itens mais vendidos');
            }
        });

        app.put('/vendas_update', async (req, res) => {
            const updatedData = req.body; // Os dados atualizados são enviados no corpo da requisição
          
            try {
              // Aqui você executa a lógica para atualizar os dados no banco de dados
              // Por exemplo, você pode iterar sobre os dados atualizados e executar uma query SQL de UPDATE para cada registro
              for (const data of updatedData) {
                await connection.query('UPDATE informacoes SET Vendedor = ?, Valor_de_Venda = ?, Forma_de_Pagamento = ? WHERE id = ?', [data.Vendedor, data.Valor_de_Venda, data.Forma_de_Pagamento, data.id]);
              }
          
              // Se os dados foram atualizados com sucesso, você pode enviar uma resposta de sucesso
              res.status(200).send('Dados atualizados com sucesso');
            } catch (error) {
              console.error('Erro ao atualizar os dados:', error);
              res.status(500).send('Erro ao atualizar os dados');
            }
          });

          app.put('/vendas_clientes_update', async (req, res) => {
            const updatedData = req.body; // Os dados atualizados são enviados no corpo da requisição

            try {

              for (const data of updatedData) {
                await connection.query('UPDATE informacoes SET Cliente = ? WHERE CNPJ_CPF_Cliente = ?', [data.Cliente, data.CNPJ_CPF_Cliente]);
              }
              res.status(200).send('Dados atualizados com sucesso');
            }
            
            catch (error) {

              console.error('Erro ao atualizar os dados:', error);
              res.status(500).send('Erro ao atualizar os dados');
            }

          });

        app.get('/dados_vendas', async (req, res) => {
            try {
                const [rows, fields] = await connection.query('SELECT Vendedor, SUM(Valor_de_Venda) AS total_vendas FROM informacoes GROUP BY Vendedor');
                res.json(rows);
            } catch (error) {
                console.error('Erro ao buscar dados de vendas:', error);
                res.status(500).send('Erro ao buscar dados de vendas');
            }
        });

        app.get('/dados_itens', async (req, res) => {
            try {
                const [rows, fields] = await connection.query('SELECT Produto, COUNT(*) AS quantidade_vendida FROM informacoes GROUP BY Produto ORDER BY quantidade_vendida DESC');
                res.json(rows);
            } catch (error) {
                console.error('Erro ao buscar dados de itens mais vendidos:', error);
                res.status(500).send('Erro ao buscar dados de itens mais vendidos');
            }
        });  

        app.get('/dados_vendas_mes', async (req, res) => {
            try {
                const [rows, fields] = await connection.query('SELECT MONTH(STR_TO_DATE(Data_da_Venda, "%Y-%m-%d")) AS mes, SUM(Valor_de_Venda) AS total_vendas FROM informacoes GROUP BY mes');
                res.json(rows);
            } catch (error) {
                console.error('Erro ao buscar dados de vendas:', error);
                res.status(500).send('Erro ao buscar dados de vendas');
            }
        });
        
        app.get('/dados_vendas_total', async (req, res) => {
            try {
                const [rows, fields] = await connection.query('SELECT SUM(Valor_de_Venda) AS total_vendas FROM informacoes');
                res.json(rows[0]); // Retorna apenas a primeira linha do resultado
            } catch (error) {
                console.error('Erro ao buscar dados de vendas:', error);
                res.status(500).send('Erro ao buscar dados de vendas');
            }
        });

        app.get('/vendedores', async (req, res) => {
            try {
                const [rows, fields] = await connection.query('SELECT id,Vendedor, CPF_Vendedor, Data_da_Venda, Valor_da_Venda, Tipo_de_Venda FROM vendedor');
                const rowsWithTipoVenda = adicionarTipoVenda(rows);
                res.json(rowsWithTipoVenda);
            } catch (error) {
                console.error('Erro ao buscar dados de vendas:', error);
                res.status(500).send('Erro ao buscar dados de vendas');
            }
        });

        app.put('/vendedores_update', async (req, res) => {
            const updatedData = req.body; // Os dados atualizados são enviados no corpo da requisição
         
            try {
              // Aqui você executa a lógica para atualizar os dados no banco de dados
              // Por exemplo, você pode iterar sobre os dados atualizados e executar uma query SQL de UPDATE para cada registro
              for (const data of updatedData) {
                await connection.query('UPDATE vendedor SET Vendedor = ?, CPF_Vendedor = ? WHERE id = ?', [data.Vendedor, data.CPF_Vendedor, data.id]);
                await connection.query('UPDATE informacoes SET Vendedor = ?, CPF_Vendedor = ? WHERE CPF_Vendedor = ?', [data.Vendedor, data.CPF_Vendedor, data.CPF_Vendedor]);
              }
         
              // Se os dados foram atualizados com sucesso, você pode enviar uma resposta de sucesso
              res.status(200).send('Dados atualizados com sucesso');
            } catch (error) {
              console.error('Erro ao atualizar os dados:', error);
              res.status(500).send('Erro ao atualizar os dados');
            }
          });

        app.delete('/vendedores/:id', async (req, res) => {
            const vendedorId = req.params.id;
            try {
              // Aqui você executa a query SQL para deletar o vendedor do banco de dados
              await connection.query('DELETE FROM vendedor WHERE id = ?', [vendedorId]);
              
              // Se o vendedor foi deletado com sucesso, você pode enviar uma resposta de sucesso
              res.status(200).send('Vendedor deletado com sucesso');
            } catch (error) {
              console.error('Erro ao deletar vendedor:', error);
              res.status(500).send('Erro ao deletar vendedor');
            }
          });

        app.get('/minhas_vendas', async (req, res) => {
            try {
                const vendedor = "111.111.111-11"; // Supondo que o CPF do vendedor esteja disponível após o login
         
                const [rows, fields] = await connection.query('SELECT * FROM informacoes WHERE CPF_Vendedor = ? ORDER BY Data_da_Venda DESC', [vendedor]);
                res.json(rows);
            } catch (error) {
                console.error('Erro ao buscar as vendas do vendedor:', error);
                res.status(500).send('Erro ao buscar as vendas do vendedor');
            }
        });

        app.get('/Comissao', async (req, res) => {
            try {
                const [rows, fields] = await connection.query('SELECT id, Vendedor, CPF_Vendedor, Produto, ID_Produto, Valor_da_Venda , Tipo_de_Venda, Porcentagem FROM comissao');
                res.json(rows);
            } catch (error) {
                console.error('Erro ao buscar as vendas do vendedor:', error);
                res.status(500).send('Erro ao buscar as vendas do vendedor');
            }
        });
        
        
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
    }
}

exportar();

// Iniciar o servidor na porta 8080
app.listen(8080, () => {
    console.log("Servidor iniciado na porta 8080: http://localhost:8080");
});
