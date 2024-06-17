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
    Email: DataTypes.STRING,
    Telefone: DataTypes.STRING,
    Endereco: DataTypes.STRING,
    Pais: DataTypes.STRING,
    Data_Nascimento: DataTypes.DATEONLY,
    foto: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Vendedor',
    tableName: 'Vendedor',
  });
  return Vendedor;
};