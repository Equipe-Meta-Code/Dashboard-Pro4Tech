'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cliente extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Cliente.init({
    Cliente: DataTypes.STRING,
    CNPJ_CPF_Cliente: DataTypes.STRING,
    Segmento_do_Cliente: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Cliente',
    tableName: 'Cliente' // Adicionando o nome correto da tabela
  });
  return Cliente;
};