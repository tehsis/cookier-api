const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('RecipeIngredients', {
        quantity: {
            type: DataTypes.FLOAT
        },
        unit: {
            type: DataTypes.STRING
        }
    });
}