'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Informacoes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Informacoes.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    Data_da_venda: DataTypes.DATE,
    Vendedor: DataTypes.STRING,
    CPF_Vendedor: DataTypes.STRING,
    Produto: DataTypes.STRING,
    ID_Produto: DataTypes.STRING,
    Cliente: DataTypes.STRING,
    CNPJ_CPF_Cliente: DataTypes.STRING,
    Segmento_do_Cliente: DataTypes.STRING,
    Valor_de_Venda: DataTypes.STRING,
    Forma_de_Pagamento: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Informacoes',
  });
  return Informacoes;
};
