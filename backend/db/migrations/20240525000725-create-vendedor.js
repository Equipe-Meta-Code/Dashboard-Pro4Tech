'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Vendedor', {
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
      Email: {
        type: Sequelize.STRING
      },
      Telefone: {
        type: Sequelize.STRING
      },
      Endereco: {
        type: Sequelize.STRING
      },
      Pais: {
        type: Sequelize.STRING
      },
      Data_Nascimento: {
        type: Sequelize.DATEONLY
      },
      foto: {
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
    await queryInterface.dropTable('Vendedor');
  }
};