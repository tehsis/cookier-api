const express = require('express');
const https = require('https');
const fs = require('fs');

const recipeRouter = require('./Routes/recipes');
const backofficeRouter = require('./Routes/backoffice');

const app = express();
const {env} = process;

const sequelize = require('./Data');

app.use(express.urlencoded());
app.use(express.json());
app.set('view engine', 'pug');

if (env.NODE_ENV !== "production") {
    app.use(express.static('imgs'))
}

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
    const port = parseInt(env.PORT, 10);

    const privateKey = fs.readFileSync(env.PRIV_KEY);
    const publicKey = fs.readFileSync(env.PUB_KEY);

    https.createServer({
      key: privateKey,
      cert: publicKey 
    }, app).listen(port);

}

init();

