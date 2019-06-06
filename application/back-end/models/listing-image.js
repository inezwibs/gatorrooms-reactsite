'use strict';
module.exports = (sequelize, DataTypes) => {
  const ListingImage = sequelize.define('ListingImage', {
    imageFile: {
      type: DataTypes.BLOB('long'),
      allowNull: false,
      get() {
        const binaryData = this.getDataValue('imageFile');
        return new Buffer(binaryData, 'binary').toString('base64');
      }
    }
  }, {
    createdAt: false,
    updatedAt: false
  });
  ListingImage.associate = function(models) {
    ListingImage.belongsTo(models.ListingPost);
  };
  return ListingImage;
};