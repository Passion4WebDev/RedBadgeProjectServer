require('dotenv').config();
const Express = require('express');
const app = Express();
const dbConnection = require('./db');

app.use(Express.json());

app.use(require("./server/middleware/headers"))

const controllers = require("./server/controllers")

app.use("/rating", controllers.ratingController);
app.use("/user", controllers.userController);

dbConnection.authenticate()
.then(() => dbConnection.sync())
.then(() => {
    app.listen( 3200, () => {
        console.log(`[Server]: App is listening on 3200.`);
    });
})
.catch((err) => {
    console.log(`[Server]: Server crash. Error =${err}`);
});
