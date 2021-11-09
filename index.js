const express = require('express');
const bodyParser = require('body-parser');

const recipeRouter = require('./Routes/recipes');
const backofficeRouter = require('./Routes/backoffice');

const app = express();
const {env} = process;

const sequelize = require('./Data');

app.use(express.urlencoded());
app.use(express.json());
app.set('view engine', 'pug');

app.get('/test', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.send("OK");
    } catch (e) {
        console.error("Error connecting to te db.", err);
    }

    res.sendStatus(500);
});


app.use('/recipes', recipeRouter);
app.use('/backoffice', backofficeRouter);

async function assertDBConnection() {
    try {
        sequelize.authenticate();
    } catch (e) {
        console.log('Unable to connect to DB', e);
        process.exit(1);
    }
}

async function init() {
    await assertDBConnection();

    await sequelize.sync();
    
    app.listen(env.PORT, () => {
        console.log('Service listening at %d', env.PORT);
    });
}

init();

