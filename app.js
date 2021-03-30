const path = require("path");
require("dotenv").config({
    path: path.resolve(__dirname, "config/.env")
});
const express = require("express");
const logger = require("morgan");
const cookieParser = require('cookie-parser');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(cookieParser());

app.use('/', require('./routes/index.js'));
app.use('/account/', require('./routes/account.js'));

app.listen(80, () => { console.log("Connected !") });