const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const userRouter = require('./routers/users');
const authRouter = require('./routers/auth');
const cardRouter = require('./routers/cards');

const app = express();

//Connect to db:
mongoose
    .connect('mongodb://localhost/project_rest_api')
    .then(() => {
        console.log('connected to mongoDB');
    })
    .catch(() => {
        console.log('could not connect to mongoDB');
    });


//Apply middleware:
app.use(express.json());
app.use(morgan("dev"));


//Routeing:
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/cards", cardRouter);


//Connected to port:
const PORT = 3003;
app.listen(PORT, () => {
    console.log(`Listening to port: ${PORT}`);
})