'use strict';
module.exports = (sequelize, DataTypes) => {
  const ListingPost = sequelize.define('ListingPost', {
    
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.FLOAT,
    line1: DataTypes.STRING,
    line2: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zipCode: DataTypes.INTEGER,
    bedrooms: DataTypes.INTEGER,
    bathrooms: DataTypes.INTEGER,
    isApproved: DataTypes.BOOLEAN,
    distance: DataTypes.FLOAT
  }, {
    createdAt: 'datePosted',
    updatedAt: false
  });
  ListingPost.associate = function(models) {
    ListingPost.belongsTo(models.User);
    ListingPost.belongsTo(models.HousingType);
    ListingPost.hasMany(models.ListingImage, {
      onDelete: 'CASCADE'
    });
    ListingPost.hasMany(models.Chat);
  };
  return ListingPost;
};