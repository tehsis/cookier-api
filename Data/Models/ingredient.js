const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Ingredient', {
        id: {
            primaryKey: true,
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        name: {
            type: Sequelize.DataTypes.STRING
        }
    });
}