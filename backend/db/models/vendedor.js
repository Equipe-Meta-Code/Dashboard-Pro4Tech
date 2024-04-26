'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vendedor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Vendedor.init({
    Vendedor: DataTypes.STRING,
    CPF_Vendedor: DataTypes.STRING,
    Data_da_Venda: DataTypes.DATE,
    Valor_da_Venda: DataTypes.DECIMAL(10, 2),
    Tipo_de_Venda: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Vendedor',
    tableName: 'Vendedor' // Adicionando o nome correto da tabela
  });
  return Vendedor;
};
