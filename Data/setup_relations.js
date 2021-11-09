module.exports = (sequelize) => {
    const { Recipe, Ingredient, Photo, RecipeIngredients } = sequelize.models;

    console.log(sequelize.models);

    Recipe.belongsToMany(Ingredient, {through: RecipeIngredients});
    Recipe.hasMany(Photo, {
        onDelete: 'CASCADE'
    });
    Ingredient.belongsToMany(Recipe, {through: RecipeIngredients});
}