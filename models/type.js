'use strict';
module.exports = function(sequelize, DataTypes) {
  var Type = sequelize.define('Type', {
    job: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    tableName: 'types',
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Type;
};