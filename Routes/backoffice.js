const express = require('express');
const router = express.Router();

const sequelize = require('../Data');
const { route } = require('./recipes');

const {Recipe} = sequelize.models;

router.get('/recipes', async (req, res) => {
    const recipes = await Recipe.findAll();
    res.render('recipes/get', {recipes});
});

router.get('/add-recipe', async(req, res) => {
    res.render('recipes/create');
});

router.post('/add-recipe', async (req, res) => {
    const { name, procedure } = req.body;
    const recipe = await Recipe.create({
        name,
        procedure
    });
    res.render('recipes/recipe', {name, procedure});
});

module.exports = router;