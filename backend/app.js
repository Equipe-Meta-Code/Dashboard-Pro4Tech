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
                const existingCliente = await db.Cliente.findOne({
                    where: { Cliente: row.Cliente }
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
                    });
                }
                if (!existingCliente) {
                    // Se o Cliente não existir, cria um novo registro na tabela Cliente
                    await db.Cliente.create({
                        Cliente: row.Cliente,
                        CNPJ_CPF_Cliente: row.CNPJ_CPF_Cliente,
                        Segmento_do_Cliente: row.Segmento_do_Cliente
                    });
                }
                await db.Comissao.create({
                    Vendedor: row.Vendedor,
                    CPF_Vendedor: row.CPF_Vendedor,
                    Produto: row.Produto,
                    ID_Produto: row.ID_Produto,
                    Valor_da_Venda: row.Valor_de_Venda
                });
                if (!existingProduto) {
                    await db.Produtos.create({
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
                await connection.query('UPDATE informacoes SET Vendedor = ?, CPF_Vendedor = ?, Cliente = ?, CNPJ_CPF_Cliente = ?, Segmento_do_Cliente = ?, Valor_de_Venda = ?, Forma_de_Pagamento = ?, Produto = ?, ID_Produto = ? WHERE id = ?',
                 [data.Vendedor, data.CPF_Vendedor, data.Cliente, data.CNPJ_CPF_Cliente, data.Segmento_do_Cliente, data.Valor_de_Venda, data.Forma_de_Pagamento,data.Produto,data.ID_Produto, data.id]);
              }
          
              // Se os dados foram atualizados com sucesso, você pode enviar uma resposta de sucesso
              res.status(200).send('Dados atualizados com sucesso');
            } catch (error) {
              console.error('Erro ao atualizar os dados:', error);
              res.status(500).send('Erro ao atualizar os dados');
            }
          });



          app.get('/dados_vendas', async (req, res) => {
            try {
                // Obter as datas de início e fim do intervalo (por exemplo, passadas como parâmetros na solicitação)
                const startDate = req.query.startDate;
                const endDate = req.query.endDate;
        
                // Consulta SQL modificada para incluir um filtro de data
                const sqlQuery = `SELECT Vendedor, SUM(Valor_de_Venda) AS total_vendas FROM informacoes WHERE Data_da_Venda >= ? AND Data_da_Venda <= ? GROUP BY Vendedor`;
        
                // Executar a consulta SQL com os parâmetros de data
                const [rows, fields] = await connection.query(sqlQuery, [startDate, endDate]);
                
                // Enviar os resultados da consulta como resposta JSON
                res.json(rows);
            } catch (error) {
                console.error('Erro ao buscar dados de vendas:', error);
                res.status(500).send('Erro ao buscar dados de vendas');
            }
        });

        app.get('/dados_itens', async (req, res) => {
            const { startDate, endDate } = req.query;

            try {
              const [rows, fields] = await connection.query(
                'SELECT Produto, COUNT(*) AS quantidade_vendida FROM informacoes WHERE Data_da_Venda >= ? AND Data_da_Venda <= ? GROUP BY Produto ORDER BY quantidade_vendida DESC',
                [new Date(startDate), new Date(endDate)]
              );
              res.json(rows);
            } catch (error) {
              console.error('Erro ao buscar dados de itens mais vendidos:', error);
              res.status(500).send('Erro ao buscar dados de itens mais vendidos');
            }
          });
          
        
          app.get('/dados_itens_user', async (req, res) => {
            try {
                const { vendedor, startDate, endDate } = req.query;
                
                if (!vendedor, !startDate, !endDate) {
                    return res.status(400).send('Parâmetros incompletos');
                }
                
        
                const query = `
                    SELECT Produto, COUNT(*) AS quantidade_vendida 
                    FROM informacoes 
                    WHERE CPF_Vendedor = ? AND Data_da_Venda >= ? AND Data_da_Venda <= ? 
                    GROUP BY Produto 
                    ORDER BY quantidade_vendida DESC
                `;
                
                const [rows] = await connection.query(query, [vendedor, startDate, endDate]);
                res.json(rows);
            } catch (error) {
                console.error('Erro ao buscar os itens mais vendidos:', error);
                res.status(500).send('Erro ao buscar os itens mais vendidos');
            }
        });

        app.get('/dados_itens_vendedor', async (req, res) => {
          try {
              const { vendedor} = req.query;
              if (!vendedor) {
                  return res.status(400).send('Parâmetros incompletos');
              }
      
              const query = 'SELECT Produto, COUNT(*) AS quantidade_vendida FROM informacoes WHERE CPF_Vendedor =? GROUP BY Produto ORDER BY quantidade_vendida DESC';
              const [rows, fields] = await connection.query(query, [vendedor]);
              res.json(rows);
          } catch (error) {
              console.error('Erro ao buscar os itens mais vendidos:', error);
              res.status(500).send('Erro ao buscar os itens mais vendidos');
          }
        });   

        app.get('/vendedor', async (req, res) => {
          try {
            const { vendedor} = req.query;
            if (!vendedor) {
                return res.status(400).send('Parâmetros incompletos');
            }

              const query = 'SELECT Vendedor, CPF_Vendedor, Email, Telefone, Endereco, Pais, Data_Nascimento,foto FROM vendedor WHERE id =?';
              const [rows, fields] = await connection.query(query, [vendedor]);
       
              res.json(rows);
          } catch (error) {
              console.error('Erro ao buscar dados de vendas:', error);
              res.status(500).send('Erro ao buscar dados de vendas');
          }
      });       
      app.get('/dados_vendas_mensais', async (req, res) => {
        try {
            const startDate = req.query.startDate;
            const endDate = req.query.endDate;
    
            if (!startDate || !endDate) {
                return res.status(400).send('Os parâmetros startDate e endDate são obrigatórios');
            }
    
            const query = `
                SELECT 
                    MONTH(STR_TO_DATE(Data_da_Venda, "%Y-%m-%d")) AS mes,
                    Produto,
                    COUNT(ID_Produto) AS quantidade_vendida,
                    SUM(Valor_de_Venda) AS total_vendas
                FROM 
                    informacoes
                WHERE 
                    Data_da_Venda BETWEEN ? AND ?
                GROUP BY 
                    mes, Produto
            `;
    
            const [rows, fields] = await connection.query(query, [startDate, endDate]);
    
            // Reformatando os dados para o frontend
            const data = rows.reduce((acc, row) => {
                const month = row.mes;
                const product = row.Produto;
                const sales = row.total_vendas;
    
                if (!acc[month]) {
                    acc[month] = { mes: month, produtos: {} };
                }
    
                acc[month].produtos[product] = sales;
                return acc;
            }, {});
    
            res.json(Object.values(data));
        } catch (error) {
            console.error('Erro ao buscar dados de vendas:', error);
            res.status(500).send('Erro ao buscar dados de vendas');
        }
    });
    
    

        app.get('/dados_vendas_mes', async (req, res) => {
            try {
              const startDate = req.query.startDate;
              const endDate = req.query.endDate;

              if (!startDate || !endDate) {
                return res.status(400).send('Os parâmetros startDate e endDate são obrigatórios');
              }
          
              const [rows, fields] = await connection.query('SELECT MONTH(STR_TO_DATE(Data_da_Venda, "%Y-%m-%d")) AS mes, SUM(Valor_de_Venda) AS total_vendas FROM informacoes WHERE Data_da_Venda BETWEEN ? AND ? GROUP BY mes', [startDate, endDate]);
              
              res.json(rows);
            } catch (error) {
              console.error('Erro ao buscar dados de vendas:', error);
              res.status(500).send('Erro ao buscar dados de vendas');
            }
          });
       
          app.get('/dados_vendas_mes_user', async (req, res) => {
            try {
                const { vendedor, startDate, endDate } = req.query;
                if (!vendedor || !startDate || !endDate) {
                    return res.status(400).send('Parâmetros incompletos');
                }
        
                const query = 'SELECT MONTH(STR_TO_DATE(Data_da_Venda, "%Y-%m-%d")) AS mes, SUM(Valor_de_Venda) AS total_vendas FROM informacoes WHERE CPF_Vendedor = ? AND Data_da_Venda >= ? AND Data_da_Venda <= ? GROUP BY mes';
                const [rows, fields] = await connection.query(query, [vendedor, startDate, endDate]);
                res.json(rows);
            } catch (error) {
                console.error('Erro ao buscar as vendas por mês:', error);
                res.status(500).send('Erro ao buscar as vendas por mês');
            }
        });

        app.get('/dados_vendas_mes_vendedores', async (req, res) => {
          try {
              const { vendedor} = req.query;
              if (!vendedor) {
                  return res.status(400).send('Parâmetros incompletos');
              }
              
              const query = 'SELECT MONTH(STR_TO_DATE(Data_da_Venda, "%Y-%m-%d")) AS mes, SUM(Valor_de_Venda) AS total_vendas FROM informacoes WHERE CPF_Vendedor = ? GROUP BY mes';
              const [rows, fields] = await connection.query(query, [vendedor]);
              res.json(rows);
          } catch (error) {
              console.error('Erro ao buscar as vendas por mês:', error);
              res.status(500).send('Erro ao buscar as vendas por mês');
          }
        });

        app.get('/dados_vendas_total', async (req, res) => {
            try {                
              const { startDate, endDate } = req.query;
              const query = 'SELECT SUM(Valor_de_Venda) AS total_vendas FROM informacoes WHERE Data_da_Venda >= ? AND Data_da_Venda <= ?';
              const [rows, fields] = await connection.query(query, [startDate, endDate]);
              res.json(rows[0]); // Retorna apenas a primeira linha do resultado
            } catch (error) {
              console.error('Erro ao buscar dados de vendas:', error);
              res.status(500).send('Erro ao buscar dados de vendas');
            }
        });
          
          app.get('/dados_vendas_total_user', async (req, res) => {
            try {
              const { vendedor, startDate, endDate } = req.query;
              
              if (!vendedor || !startDate || !endDate) {
                return res.status(400).send('Parâmetros incompletos');
              }
              
              const query = 'SELECT SUM(Valor_de_Venda) AS total_vendas FROM informacoes WHERE CPF_Vendedor = ? AND Data_da_Venda >= ? AND Data_da_Venda <= ?';
              const [rows, fields] = await connection.query(query, [vendedor, startDate, endDate]);
              res.json(rows[0]); // Retorna apenas a primeira linha do resultado
            } catch (error) {
              console.error('Erro ao buscar dados de vendas:', error);
              res.status(500).send('Erro ao buscar dados de vendas');
            }
          });
          

        app.get('/vendedores', async (req, res) => {
            try {
                const [rows, fields] = await connection.query('SELECT id,Vendedor, CPF_Vendedor, Email, Telefone, Endereco, Pais, Data_Nascimento,foto FROM vendedor');
                const rowsWithTipoVenda = adicionarTipoVenda(rows);
                res.json(rowsWithTipoVenda);
            } catch (error) {
                console.error('Erro ao buscar dados de vendas:', error);
                res.status(500).send('Erro ao buscar dados de vendas');
            }
        });

        const moment = require('moment'); // Importa a biblioteca moment.js para manipulação de datas

        app.post('/vendedores_adicionar', async (req, res) => {
          const newData = req.body; // Os dados atualizados são enviados no corpo da requisição
          try {
            const now = moment().format('YYYY-MM-DD HH:mm:ss'); // Obtém a data e hora atuais no formato desejado
        
            // Adiciona createdAt e updatedAt aos dados recebidos
            newData.createdAt = now;
            newData.updatedAt = now;
        
            // Insere os dados na tabela vendedor
            await connection.query('INSERT INTO vendedor SET ?', newData);
        
            res.status(200).send('Dados atualizados com sucesso');
          } catch (error) {
            console.error('Erro ao atualizar os dados:', error);
            res.status(500).send('Erro ao atualizar os dados');
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

        app.put('/vendedores_editando', async (req, res) => {
          const updatedData = req.body; // Os dados atualizados são enviados no corpo da requisição
          
          try {
            // Verificação dos dados recebidos
            if (!updatedData.Vendedor || !updatedData.CPF_Vendedor) {
              return res.status(400).send('Dados inválidos');
            }
        
            // Atualização no banco de dados
            await connection.query('UPDATE vendedor SET Vendedor = ?, Email = ?, Telefone = ?, Endereco = ?, Pais = ? WHERE CPF_Vendedor = ?', 
            [updatedData.Vendedor,updatedData.Email, updatedData.Telefone,updatedData.Endereco,updatedData.Pais, updatedData.CPF_Vendedor]);
            
            await connection.query('UPDATE informacoes SET Vendedor = ? WHERE CPF_Vendedor = ?', [updatedData.Vendedor, updatedData.CPF_Vendedor]);

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

        // Rota para obter as vendas do vendedor
        app.get('/minhas_vendas', async (req, res) => {
            try {
                const vendedor = "433.534.428-71"; // Supondo que o CPF do vendedor esteja disponível após o login
                const query = 'SELECT * FROM informacoes WHERE CPF_Vendedor = ? ORDER BY Data_da_Venda DESC';
                
                connection.query(query, [vendedor], (error, results) => {
                    if (error) {
                        console.error('Erro ao buscar as vendas do vendedor:', error);
                        res.status(500).send('Erro ao buscar as vendas do vendedor');
                        return;
                    }
                    res.json(results);
                });
            } catch (error) {
                console.error('Erro ao buscar as vendas do vendedor:', error);
                res.status(500).send('Erro ao buscar as vendas do vendedor');
            }
        });

        

        app.get('/clientes', async (req, res) => {
            try {
                const [rows, fields] = await connection.query('SELECT id,Cliente, CNPJ_CPF_Cliente, Segmento_do_Cliente FROM cliente');
                res.json(rows);
            } catch (error) {
                console.error('Erro ao buscar dados de vendas:', error);
                res.status(500).send('Erro ao buscar dados de vendas');
            }
        });

        app.put('/vendas_clientes_update', async (req, res) => {
            const updatedData = req.body; // Os dados atualizados são enviados no corpo da requisição

            try {

              for (const data of updatedData) {
                await connection.query('UPDATE informacoes SET Cliente = ?, Segmento_do_Cliente = ? WHERE CNPJ_CPF_Cliente = ?', [data.Cliente, data.Segmento_do_Cliente, data.CNPJ_CPF_Cliente]);
                await connection.query('UPDATE cliente SET Cliente = ?, Segmento_do_Cliente = ? WHERE CNPJ_CPF_Cliente = ?', [data.Cliente, data.Segmento_do_Cliente, data.CNPJ_CPF_Cliente]);
            }
              res.status(200).send('Dados atualizados com sucesso');
            }
            
            catch (error) {

              console.error('Erro ao atualizar os dados:', error);
              res.status(500).send('Erro ao atualizar os dados');
            }

          });
        app.post('/clientes_adicionar', async (req, res) => {
            const newData = req.body; // Os dados atualizados são enviados no corpo da requisição
            try {
              const now = moment().format('YYYY-MM-DD HH:mm:ss'); // Obtém a data e hora atuais no formato desejado
              
              // Adiciona createdAt e updatedAt aos dados recebidos
              newData.createdAt = now;
              newData.updatedAt = now;
          
              // Insere os dados na tabela cliente
              await connection.query('INSERT INTO cliente SET ?', newData);
          
              res.status(200).send('Dados atualizados com sucesso');
            } catch (error) {
              console.error('Erro ao atualizar os dados:', error);
              res.status(500).send('Erro ao atualizar os dados');
            }
          });

          app.post('/produto_adicionar', async (req, res) => {
            const newData = req.body; 
            try {
              const now = moment().format('YYYY-MM-DD HH:mm:ss'); 

              newData.createdAt = now;
              newData.updatedAt = now;

              await connection.query('INSERT INTO produtos SET ?', newData);
          
              res.status(200).send('Dados atualizados com sucesso');
            } catch (error) {
              console.error('Erro ao atualizar os dados:', error);
              res.status(500).send('Erro ao atualizar os dados');
            }
          });

          app.post('/vendas_adicionar', async (req, res) => {
            const newData = req.body; // Os dados atualizados são enviados no corpo da requisição
            try {
              const now = moment().format('YYYY-MM-DD HH:mm:ss'); // Obtém a data e hora atuais no formato desejado

              // Adiciona createdAt e updatedAt aos dados recebidos
              newData.createdAt = now;
              newData.updatedAt = now;
          
              // Insere os dados na tabela vendedor
              await connection.query('INSERT INTO informacoes SET ?', newData);
          
              res.status(200).send('Dados atualizados com sucesso');
            } catch (error) {
              console.error('Erro ao atualizar os dados:', error);
              res.status(500).send('Erro ao atualizar os dados');
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

        app.get('/produtos', async (req, res) => {
            try {
                const [rows, fields] = await connection.query('SELECT id, Produto, Valor_de_Venda from produtos');
                res.json(rows);
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
                res.status(500).send('Erro ao buscar produtos');
            }
        });

        app.post('/produtos_adicionar', async (req, res) => {
            const newData = req.body; // Os dados atualizados são enviados no corpo da requisição
            try {
              const now = moment().format('YYYY-MM-DD HH:mm:ss'); // Obtém a data e hora atuais no formato desejado
              // Adiciona createdAt e updatedAt aos dados recebidos
              newData.createdAt = now;
              newData.updatedAt = now;
          
              // Insere os dados na tabela produtos
              await connection.query('INSERT INTO produtos SET ?', newData);
          
              res.status(200).send('Dados atualizados com sucesso');
            } catch (error) {
              console.error('Erro ao atualizar os dados:', error);
              res.status(500).send('Erro ao atualizar os dados');
            }
        });

        app.delete('/produtos/:id', async (req, res) => {
          const produtosId = req.params.id;
          try {
            // Aqui você executa a query SQL para deletar o produtos do banco de dados
            await connection.query('DELETE FROM produtos WHERE id = ?', [produtosId]);
            
            // Se o produtos foi deletado com sucesso, você pode enviar uma resposta de sucesso
            res.status(200).send('produtos deletado com sucesso');
          } catch (error) {
            console.error('Erro ao deletar produtos:', error);
            res.status(500).send('Erro ao deletar produtos');
          }
        });

        app.put('/vendas_update_produto', async (req, res) => {
            const updatedData = req.body; // Os dados atualizados são enviados no corpo da requisição
          
            try {
              // Aqui você executa a lógica para atualizar os dados no banco de dados
              // Por exemplo, você pode iterar sobre os dados atualizados e executar uma query SQL de UPDATE para cada registro
              for (const data of updatedData) {
                await connection.query('UPDATE informacoes SET Produto = ?, Valor_de_Venda = ? WHERE id = ?', [data.Produto, data.Valor_de_Venda, data.id]);
              }
          
              // Se os dados foram atualizados com sucesso, você pode enviar uma resposta de sucesso
              res.status(200).send('Dados atualizados com sucesso');
            } catch (error) {
              console.error('Erro ao atualizar os dados:', error);
              res.status(500).send('Erro ao atualizar os dados');
            }
        });
        
        app.put('/produtos_update', async (req, res) => {
            const updatedData = req.body; // Os dados atualizados são enviados no corpo da requisição

            if (!Array.isArray(updatedData)) {
              console.error('Erro ao atualizar os dados: updatedData não é um array');
              return res.status(400).send('Dados inválidos');
          }

            try {

              for (const data of updatedData) {
                await connection.query('UPDATE informacoes SET Produto = ?, Valor_de_Venda = ? WHERE ID_Produto = ?', [data.Produto, data.Valor_de_Venda, data.id]);
                await connection.query('UPDATE produtos SET Produto = ?, Valor_de_Venda = ? WHERE id = ?', [data.Produto, data.Valor_de_Venda, data.id]);
            }
              res.status(200).send('Dados atualizados com sucesso');
            }
            
            catch (error) {

              console.error('Erro ao atualizar os dados:', error);
              res.status(500).send('Erro ao atualizar os dados');
            }

          });
        
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
    }
}

app.get('/vendas_filtradas', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);

        const [rows, fields] = await connection.query(
            'SELECT createdAt FROM informacoes WHERE createdAt >= ? AND createdAt <= ?',
            [startDateObj, endDateObj]
        );

        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar as vendas', error);
        res.status(500).send('Erro ao buscar as vendas');
    }
});

exportar();

// Iniciar o servidor na porta 8080
app.listen(8080, () => {
    console.log("Servidor iniciado na porta 8080: http://localhost:8080");
});
