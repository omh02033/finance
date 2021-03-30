const express = require("express");
const router = express.Router();
const config = require('../config/jwt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const path = require('path');
const moment = require('moment');

let conn = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: 'nagongfinance'
});
conn.connect();

router
.post('/login/', (req, res) => {
    let sql = 'SELECT * FROM account WHERE id=?';
    conn.query(sql, [req.body.phone], (err, data) => {
        if(err) return res.status(200).json({result: false});
        if(data.length == 0) {
            return res.status(200).json({ result: false });
        }
        let user = data[0];
        let token = jwt.sign({ phone: user.id, star: user.star, definance: user.default_finance }, config.secret, {expiresIn: '100d'});
        res.cookie("user", token);
        res.status(200).json({ result: true, name: user.name });
    });
})

module.exports = router;