const Sequelize = require('sequelize');

const setupRelations = require('./setup_relations');

const { env } = process;

const sequelize = new Sequelize(env.DB);

const modelDefiners = [
    require('./Models/recipe'),
    require('./Models/ingredient'),
    require('./Models/photo'),
    require('./Models/recipe_ingredients')
];

for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
}

setupRelations(sequelize);

module.exports = sequelize;