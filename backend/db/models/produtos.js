'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Produtos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Produtos.init({
    Produto: DataTypes.STRING,
    Valor_de_Venda: DataTypes.DECIMAL(10,2)
  }, {
    sequelize,
    modelName: 'Produtos',
    tableName: 'Produtos'
  });
  return Produtos;
};