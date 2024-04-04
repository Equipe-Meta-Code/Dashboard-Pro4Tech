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
        const workbook = xlsx.readFile(arquivoXLSX);

        // Obter a primeira planilha
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Converter a planilha em um array de objetos JavaScript
        const data = xlsx.utils.sheet_to_json(worksheet);

        // Salvar os dados no banco de dados
        for (const row of data) {
            const user = await db.Informacoes.findOne({
                where: { CPF_Vendedor: row.CPF_Vendedor }
            });

            if (!user) {
                await db.Informacoes.create(row);
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

// Iniciar o servidor na porta 8080
app.listen(8080, () => {
    console.log("Servidor iniciado na porta 8080: http://localhost:8080");
});