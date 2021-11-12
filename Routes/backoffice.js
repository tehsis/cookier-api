const fs = require('fs');
const os = require('os');
const path = require('path');
const express = require('express');
const busboy = require('connect-busboy');
const { v4 } = require('uuid');
const aws = require('aws-sdk');
const _ = require('lodash');

const sequelize = require('../Data');
const { env } = require('process');

const router = express.Router();


const {Recipe, Photo, Ingredient} = sequelize.models;


aws.config.update({region: env.AWS_REGION})
const s3 = new aws.S3({apiVersion: '2006-03-01'});

router.use(busboy());

router.get('/recipes', async (req, res) => {
    const recipes = await Recipe.findAll();
    res.render('recipes/get', {recipes});
});

router.get('/add-recipe', async(req, res) => {
    const ingredients = await Ingredient.findAll();
    res.render('recipes/create', {ingredients});
});

router.post('/add-recipe', async (req, res) => {
    const newRecipe = {};

    req.busboy.on('error', (error) => {
        console.log(error);
    })

    req.busboy.on('field', (name, value) => {
        _.set(newRecipe, name, value);
    });

    let photo;
    req.busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
        try {
            // Create a photo, add the relationship
            const ext = path.extname(filename);
            photo = await Photo.create({
                url: `${v4()}${ext}`
            });
            // TODO: normalize imgs
            
            if (env.NODE_ENV !== "production") {
                file.pipe(fs.createWriteStream(path.join('imgs', photo.url)));
            } else {
                const params = {
                    Bucket: env.AWS_S3_BUCKET,
                    Key: photo.url,
                    Body: file
                }

                s3.upload(params, (err, data) => {
                    if (err) {
                        console.log("Error uploading file", err);
                      } if (data) {
                        console.log("Upload Success", data.Location);
                      }
                });
            }
            
            

            createAssociation()
        } catch (e) {
            res.sendStatus(400);
        }
    });

    let recipe;
    req.busboy.on('finish', async () => {
        recipe = await Recipe.create({
            name: newRecipe.name,
            procedure: newRecipe.procedure
        });

        createAssociation()

        res.redirect(`/backoffice/recipes/${recipe.id}`);
    });

    async function createAssociation() {
        console.log('Creating photo association');
        if (recipe && photo) {
            await recipe.setPhotos([photo]);
            console.log('saving photo');
            try {
                for (const ingredient of newRecipe.ingredient) {
                    await recipe.addIngredient(ingredient.id, {
                        through: {
                            unit: ingredient.unit,
                            quantity: ingredient.quantity
                        }
                    });
                }
            } catch (e) {
                console.log(e);
            }
            try {
                await recipe.save();
            } catch (e) { 
                console.log('photo saved');
            }
        }

    }

    req.pipe(req.busboy);
});

router.get('/recipes/:id', async (req, res) => {
    const {id} = req.params;
    const recipe = await Recipe.findByPk(id, {
        include: [Photo, Ingredient]
    });

    if (recipe != null) {
        const {name, procedure, Photos, Ingredients} = recipe;
        return res.render('recipes/recipe', {name, procedure, Photos, Ingredients, title: name});
    }

    res.sendStatus(404);
});

router.get('/add-ingredient', (req, res) => {
    res.render('ingredients/add-ingredient');
});

router.post('/add-ingredient', async (req, res) => {
    const { name } = req.body;
    await Ingredient.create({ name });
    res.redirect('/backoffice/ingredients');
});

router.get('/ingredients', async (req, res) => {
    const ingredients = await Ingredient.findAll();
    res.render('ingredients/ingredients', { ingredients });
});

module.exports = router;