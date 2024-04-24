COMO RODAR O PROJETO BAIXADO
Instalar todas as dependencias indicada pelo package.json
### npm install

Criar a base de dados "upload" no MySQL
Alterar as credencias do banco de dados no arquivo ".env"

Criar a Models Informacoes
### npx sequelize-cli model:generate --name Informacoes --attributes Data_da_venda:string,Vendedor:string,CPF_Vendedor:string,Produto:string,ID_Produto:string,Cliente:string,CNPJ_CPF_Cliente:string,Segmento_do_Cliente:string,Valor_de_Venda:string,Forma_de_Pagamento:string

Executar as migrations
### npx sequelize-cli db:migrate

Rodar o projeto
### node app.js

Rodar o projeto usando o nodemon
### nodemon app.js

Abrir o endereço no navegador para acessar a página inicial
### http://localhost:8080



SEQUENCIA PARA CRIAR O PROJETO
Criar o arquivo package
### npm init

Gerencia as requisições, rotas e URLs, entre outra funcionalidades
### npm install --save express

Rodar o projeto
### node app.js

Instalar a dependência de forma global, "-g" significa globalmente. Executar o comando através do prompt de comando, executar somente se nunca instalou a dependência na maquina, após instalar, reiniciar o PC.
### npm install -g nodemon

Instalar a dependência como desenvolvedor para reiniciar o servidor sempre que houver alteração no código fonte.
### npm install --save-dev nodemon

Rodar o projeto usando o nodemon
### nodemon app.js

Abrir o endereço no navegador para acessar a página inicial
### http://localhost:8080

Importar CSV
### npm install csv

Comando SQL para criar a base de dados
### CREATE DATABASE upload CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

Sequelize é uma biblioteca Javascript que facilita o gerenciamento do banco de dados SQL
### npm install --save sequelize

Instalar o drive do banco de dados
### npm install --save mysql2

Sequelize-cli interface de linha de comando usada para criar modelos, configurações e arquivos de migração para bancos de dados
### npm install --save-dev sequelize-cli

Iniciar o Sequelize-cli e criar o arquivo config
### npx sequelize-cli init

Manipular variáveis de ambiente
### npm install --save dotenv

Criar a Models Informacoes
### npx sequelize-cli model:generate --name Informacoes --attributes Data_da_venda:string,Vendedor:string,CPF_Vendedor:string,Produto:string,ID_Produto:string,Cliente:string,CNPJ_CPF_Cliente:string,Segmento_do_Cliente:string,Valor_de_Venda:string,Forma_de_Pagamento:string

Executar as migrations
### npx sequelize-cli db:migrate

Multer é um middleware node.js para manipulação multipart/form-data, usado para o upload de arquivos. 
### npm install --save multer

Criar a Models arquivo
### npx sequelize-cli model:generate --name Arquivos --attributes arquivo:string

Executar down - rollback - Permite que seja desfeita a migration, permitindo a gestão das alterações do banco de dados, versionamento.
### npx sequelize-cli db:migrate:undo --name nome-da-migration

Permitir requisição externa
### npm install cors