'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class porcentagem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  porcentagem.init({
    Tipo_de_Venda: DataTypes.STRING,
    Porcentagem: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'porcentagem',
    tableName: 'porcentagem', //adicionando o nome correto da tabela 
  });
  return porcentagem;
};