'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comissao extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  comissao.init({
    Vendedor: DataTypes.STRING,
    CPF_Vendedor: DataTypes.STRING,
    Produto: DataTypes.STRING,
    ID_Produto: DataTypes.STRING,
    Valor_da_Venda: DataTypes.STRING,
    Tipo_de_Venda: DataTypes.STRING,
    Porcentagem: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Comissao',
    tableName: 'Comissao' // Adicionando o nome correto da tabela
  });
  return comissao;
};
