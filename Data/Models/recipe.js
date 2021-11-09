const Sequelize = require('sequelize');

/**
 * 
 * @param {Sequelize} sequelize 
 */
module.exports = (sequelize) => {
    sequelize.define('Recipe', {
        id: {
            primaryKey: true,
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        name: {
            allowNull: false,
            type: Sequelize.DataTypes.STRING
        },
        procedure: {
            allowNull: false,
            type: Sequelize.DataTypes.STRING
        }
    });
}