const express = require('express');

const sequelize = require('../Data');

const router = express.Router();

const {Recipe, Ingredient, Photo} = sequelize.models;

router.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json");

    return next();
});


router.get('/', async (req, res) => {
    const recipes = await Recipe.findAll({
        include: [Ingredient, Photo]
    });

    res.send(recipes);
});

router.post('/', async (req, res) => {
    const { name, procedure } = req.body;

    try {
        const newRecipe = await Recipe.create({
            name,
            procedure
        });

        res.json({recipes: [newRecipe] });

    } catch (e) {
        console.log(e);
        res.status(500).json({error: true});
    }
    

});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Recipe.destroy({
            where: {
                id
            }
        })
        res.send(204);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
    
});

module.exports = router;