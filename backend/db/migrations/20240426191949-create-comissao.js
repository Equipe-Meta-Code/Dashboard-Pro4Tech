'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Comissao', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      Valor_da_Venda: {
        type: Sequelize.DECIMAL(10,2)
      },
      Tipo_de_Venda: {
        type: Sequelize.STRING
      },
      Porcentagem: {
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
    await queryInterface.dropTable('Comissao');
  }
};
