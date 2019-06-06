'use strict';
module.exports = (sequelize, DataTypes) => {
  const HousingType = sequelize.define('HousingType', {
    type: DataTypes.STRING
  }, {
    createdAt: false,
    updatedAt: false
  });
  HousingType.associate = function(models) {
    HousingType.hasMany(models.ListingPost);
  };
  return HousingType;
};