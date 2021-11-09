const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Photo', {
        id: {
            primaryKey: true,
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        url: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        }
    });
}