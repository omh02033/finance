const express = require("express");
const router = express.Router();
const config = require('../config/jwt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const path = require('path');
const moment = require('moment');
const yahooFinance = require('yahoo-finance');
const axios = require('axios');
const { start } = require("repl");

let conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nagongfinance'
});
conn.connect();

router
.get('/', (req, res) => {
    let token = req.cookies.user;
    if(!token) return res.sendFile('login.html', { root: path.join(__dirname, '../public/html/account') });
    jwt.verify(token, config.secret, (err, decoded) => {
        if(err) return res.json(err);
        let sql = 'SELECT * FROM account WHERE id=?';
        conn.query(sql, [decoded.phone], (err1, data) => {
            if(err1) return res.json(err1);
            res.clearCookie("user");
            let user = data[0];
            let token = jwt.sign({ phone: user.id, star: user.star, definance: user.default_finance, view: user.view }, config.secret, {expiresIn: '100d'});
            res.cookie("user", token);
            let today_date = moment().format("MM월 DD일");
            if(today_date.substring(0, 1) == '0') {
                today_date = today_date.substring(1);
            }
            res.locals.today_date = today_date;
            res.render('index');
        });
    });
})
.get('/test/', (req, res) => {
    res.sendFile('test.html', { root: path.join(__dirname, '../') });
})

.post('/finance/', async (req, res) => {
    let token = req.cookies.user;
    if(!token) return res.sendFile('login.html', { root: path.join(__dirname, '../public/html/account') });
    jwt.verify(token, config.secret, async (err, decoded) => {
        if(err) return res.status(400).json({ result: false, err: err });
        let star = JSON.parse(decoded.star);
        let definance = JSON.parse(decoded.definance);
        let view = JSON.parse(decoded.view);

        let star_status = false;
        let definance_status = false;
        let view_status = false;

        if(star.length > 0) star_status = true;
        if(definance.length > 0) definance_status = true;
        if(view.length > 0) view_status = true;

        let finance_star = [];
        let finance_definance = [];
        let finance_view = [];

        if(star_status) finance_star = await get_finance_info(star);
        if(definance_status) finance_definance = await get_finance_info(definance);
        if(view_status) finance_view = await get_finance_info(view);

        res.status(200).json({ result: true, data_star: finance_star, data_definance: finance_definance, data_view: finance_view, star_status: star_status, definance_status: definance_status, view_status: view_status, star: star, definance: definance, view: view });
    });
})

.post('/chart/preview', async (req, res) => {
    let result = {};
    let a = await get_chart_info_preview(req.body.symbols);
    let b = [];

    for(let j in a.timestamp) {
        if(!a.indicators.quote[0].close[j]) continue;
        b.push({ 'time': a.timestamp[j], 'value': Number(a.indicators.quote[0].close[j].toFixed(2)) });
    }

    for(let j=b[b.length-1].time+300; j>a.meta.tradingPeriods[0][0].end; j+=300) {
        b.push({ 'time': j });
    }
    result[req.body.symbols] = { data: b, from: a.meta.tradingPeriods[0][0].start, to: a.meta.tradingPeriods[0][0].end };
    res.status(200).json(result);
})

.post('/chart/bottom/fast/:symbol', async (req, res) => {
    let info = await fast_get_bottom_graph_info(req.params.symbol);
    res.status(200).json({data: info});
})

.post('/chart/bottom/:symbol', async (req, res) => {
    let info = await get_bottom_graph_info(req.params.symbol);
    res.status(200).json({data: info});
})

module.exports = router;

async function fast_get_bottom_graph_info(symbol) {
    let info = {};

    const getBreeds = async () => {
        return new Promise(async function(resolve, reject) {
            try {
                let a = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?symbol=${symbol}&range=1d&interval=1m`);
                info['1일'] = a.data.chart.result;
            } catch(err) {
                console.log(err + '\nerr_code:2');
                info[k_b[i]] = null;
            }
            resolve(info);
        });
    }
    return await getBreeds().then(data => { return data; });
}

async function get_bottom_graph_info(symbol) {
    let info = {};
    let b = ['1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y', '10y'];
    let k_b = ['1일', '5일', '1달', '3달', '6달', '1년', '2년', '5년', '10년'];
    let s = ['1m', '5m', '30m', '60m', '1d', '1d', '1d', '1wk', '1wk'];
    
    const getBreeds = async () => {
        return new Promise(async function(resolve, reject) {
            for(let i=0; i<b.length; i++) {
                try {
                    let a = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?symbol=${symbol}&range=${b[i]}&interval=${s[i]}`);
                    info[k_b[i]] = a.data.chart.result;
                } catch(err) {
                    console.log(err + '\nerr_code:1');
                    info[k_b[i]] = {};
                }
            }
            resolve(info);
        });
    }
    return await getBreeds().then(data => {
        return data;
    });

}

async function get_finance_info(symbol) {
    let info = await yahooFinance.quote({
        symbols: symbol,
        modules: [ 'price', 'summaryDetail' ]
    }, function(err, quotes) {
        if(err) console.error(err);
        else {
            return quotes;
        }
    });

    async function get_korea_name(sb) {
        const response = await axios.get(`https://m.stock.naver.com/api/item/getOverallHeaderItem.nhn?code=${sb.split('.')[0]}`)
        return response.data.result.nm;
    }
    for(let sb of symbol) {
        if(sb.split('.')[1] == 'KS' || sb.split('.')[1] == 'KQ') {
            info[sb]['korea_name'] = await get_korea_name(sb);
        }
    }

    return info;
}
async function get_chart_info_preview(symbol) {
    const getBreeds = async () => {
        try {
            return await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?symbol=${symbol}&range=1d&interval=5m`);
        } catch(err) {
            console.error(err);
        }
    };
    
    const countBreeds = async () => {
        const breeds = await getBreeds();
        return breeds.data.chart.result[0];
    }
    return await countBreeds();
}