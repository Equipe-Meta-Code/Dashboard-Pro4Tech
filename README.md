<h1 align="center"> Projeto API - 3º Semestre </h1>

## 🎯 Objetivo
 Desenvolver  uma solução dinâmica e eficiente para a análise de dados de vendas, utilizando planilhas do Excel como fonte de informação. Nosso objetivo é fornecer uma ferramenta acessível e intuitiva que permita a empresa entender melhor seu desempenho de vendas e tomar decisões estratégicas fundamentadas.


 ## 📍 Requisitos funcionais
•	Desenvolver em JavaScript e TypeScript (Requisito Fatec).

•	O sistema deverá reter dados de planilhas do excel e analisar as vendas por meio de gráficos, contendo funcionalidade de filtragem.

•	O sistema deverá ser capaz de calcular a comissão de cada vendendor de acordo com suas respectivas vendas e seus diferentes tipos.

•	O sistema deverá conter uma área de login e cadastro para funcionários e gerência. 

•	O sistema deverá conter uma interface exclusiva para a gerência, onde seja possível atribuir maior porcentagem nas comissões de um funcionário.




## 📍 Requisitos não-funcionais
•	Documentação via GitHub.

•	Protótipo criado no Figma.

•	Modelagem de Banco de Dados.

•	Interface responsiva e amigável para facilitar o acesso e a utilização do dashboard em diferentes dispositivos e tamanhos de tela. 

•	Garantia de desempenho e escalabilidade do sistema, mesmo com grandes volumes de dados de vendas e usuários simultâneos. 




## 🔧 Tecnologias utilizadas
- ![TypeScript](https://img.shields.io/badge/TypeScript-0B1320?style=for-the-badge&logo=Typescript&logoColor=white)

- ![JavaScript](https://img.shields.io/badge/JavaScript-0B1320?style=for-the-badge&logo=JavaScript&logoColor=white)

- ![MySQL](https://img.shields.io/badge/MySQL-0B1320?style=for-the-badge&logo=mysql&logoColor=white)

- ![REACT](https://img.shields.io/badge/React-0B1320?style=for-the-badge&logo=react&logoColor=white)

- ![NODEJS](https://img.shields.io/badge/NodeJS-0B1320?style=for-the-badge&logo=javascript&logoColor=white)

- ![FIGMA](https://img.shields.io/badge/Figma-0B1320?style=for-the-badge&logo=figma&logoColor=white)

- ![Trello](https://img.shields.io/badge/Trello-0B1320?style=for-the-badge&logo=Trello&logoColor=white)

- ![Microsoft](https://img.shields.io/badge/Microsoft_Office-0B1320?style=for-the-badge&logo=microsoft-office&logoColor=white)

- ![GITHUB](https://img.shields.io/badge/GitHub-0B1320?style=for-the-badge&logo=github&logoColor=white)
  
- ![SLACK](https://img.shields.io/badge/Slack-0B1320?style=for-the-badge&logo=slack&logoColor=white)

<span id="sprints">

## 📊 Sprints e Backlog
<img src="https://github.com/Equipe-Meta-Code/Dashboard-Pro4Tech/assets/127700485/3028884e-35e3-4e14-aef8-9309786f82ae" width="638">

<img src="https://github.com/Equipe-Meta-Code/Dashboard-Pro4Tech/assets/127700485/1b43bab9-17c5-4add-85db-d45a53825247" width="638">





<span id="user">

## 📊 User Stories



<span id="MVP">
 
## 📋 MVP
<img src="https://github.com/Equipe-Meta-Code/Dashboard-Code/assets/127700485/2a43fa6f-658e-44f6-9509-5f7ee33763ba" width="638">



<span id="Diagrama de classes">
 
## 📁 Diagrama de classes (UML)



<span id="Vídeo">
 
## 📽️ Vídeo final
<details>
   <summary>Vídeo</summary>
    <div align="center">
        







https://github.com/Equipe-Meta-Code/Dashboard-Pro4Tech/assets/126246097/8f5ca52b-6d12-4579-a69c-624aa4a1faa1





    </div>
</details>



<p align="right">
  <a href="#topo">
    <img src="https://user-images.githubusercontent.com/123789443/270016279-157e5646-66d0-4178-9073-5faf685620ba.png" alt="Seta para cima" width="40">
  </a>
</p>

# Guia de Instalação

Este guia oferece instruções detalhadas sobre como baixar, configurar e executar este projeto em sua máquina local.

## Pré-requisitos

Antes de começar, certifique-se de ter os seguintes requisitos instalados em sua máquina:

- [Visual Studio Code](https://code.visualstudio.com/)
- [Node.js](https://nodejs.org/)
- [MySQL](https://www.mysql.com/)

## Instalação

1. **Baixando o projeto**

   - Baixe o arquivo zip do projeto no GitHub e extraia-o para uma pasta local em seu computador.
   - Abra a pasta do projeto no Visual Studio Code.

2. **Configurando o Banco de Dados**

   - Utilize o MySQL para criar um banco de dados chamado `upload`.
   - No arquivo `.env` localizado no diretório do projeto, preencha as informações de conexão com o banco de dados, incluindo o nome de usuário e senha.

3. **Instalando as dependências**

   Abra três terminais no Visual Studio Code:

   - Terminal 1: Frontend (Dashboard)
     ```bash
     cd dashboard
     npm install
     ```

   - Terminal 2: Backend
     ```bash
     cd backend
     npm install
     npx sequelize-cli db:migrate
     ```

   - Terminal 3: Backend de Acessos
     ```bash
     cd backend_acessos
     npm install
     npm run typeorm -- -d ./src/database/data-source.ts migration:run
     ```

## Executando o Projeto

Após completar as etapas de instalação, você pode iniciar o projeto executando os seguintes comandos em seus respectivos terminais:

- Terminal 1: Frontend (Dashboard)
  ```bash
  npm run dev
  ```


- Terminal 2: Backend
  ```bash
  nodemon app.js
  ```
  
 - Terminal 3: Backend_acessos
  ```bash
  nodemon app.js
  ```
