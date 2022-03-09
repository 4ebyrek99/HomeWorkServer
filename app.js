const express    = require('express');
const bodyParser = require('body-parser');
const mongoose   = require('mongoose');
const passport   = require('passport');
const cookieParser = require('cookie-parser');


const configDB    = require('./config/db');
const routerAccount = require('./routes/account');


const app = express();

app.use(passport.initialize());
require('./config/passport');

app.use(bodyParser.json());
app.use(cookieParser());

app.use('/account', routerAccount);


mongoose.connect(configDB.db, {useNewUrlParser: true});

mongoose.connection.on('connected', () =>{
    console.log('База данных подключена!')
})
mongoose.connection.on('error', (err) =>{
    console.log('Ошибка подключения к базе данных - ', err)
})

app.listen(3000, ()=>{
    console.log("Сервер запущен!");
})