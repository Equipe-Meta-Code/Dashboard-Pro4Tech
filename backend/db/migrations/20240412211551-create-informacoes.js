'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Informacoes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Data_da_Venda: {
        type: Sequelize.DATE
      },
      Vendedor: {
        type: Sequelize.STRING
      },
      CPF_Vendedor: {
        type: Sequelize.STRING
      },
      Produto: {
        type: Sequelize.STRING
      },
      ID_Produto: {
        type: Sequelize.STRING
      },
      Cliente: {
        type: Sequelize.STRING
      },
      CNPJ_CPF_Cliente: {
        type: Sequelize.STRING
      },
      Segmento_do_Cliente: {
        type: Sequelize.STRING
      },
      Valor_de_Venda: {
        type: Sequelize.STRING
      },
      Forma_de_Pagamento: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Informacoes');
  }
};
