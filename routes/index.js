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
const { lookup } = require("dns");

let conn = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
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
            let token = jwt.sign({ phone: user.id, star: user.star, definance: user.default_finance }, config.secret, {expiresIn: '100d'});
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

.post('/finance/', async (req, res) => {
    let token = req.cookies.user;
    if(!token) return res.sendFile('login.html', { root: path.join(__dirname, '../public/html/account') });
    jwt.verify(token, config.secret, async (err, decoded) => {
        if(err) return res.status(400).json({ result: false, err: err });
        let star = JSON.parse(decoded.star);
        let definance = JSON.parse(decoded.definance);

        let star_status = false;
        let definance_status = false;

        if(star.length > 0) star_status = true;
        if(definance.length > 0) definance_status = true;

        let finance_star = [];
        let finance_definance = [];

        if(star_status) finance_star = await get_finance_info(star);
        if(definance_status) finance_definance = await get_finance_info(definance);

        res.status(200).json({ result: true, data_star: finance_star, data_definance: finance_definance, star_status: star_status, definance_status: definance_status, star: star, definance: definance });
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

.post('/chart/guess', async (req, res) => {
    await guess_finance(req.body.symbol, req, res);
})

.post('/search', async (req, res) => {
    let data = await search(req.body.val);
    res.status(200).json({data: data});
})

.post('/star/add', (req, res) => {
    let token = req.cookies.user;
    jwt.verify(token, config.secret, (err, decoded) => {
        if(err) return res.status(400).json({ result: false, err: err, msg: err });
        let star = JSON.parse(decoded.star);
        star.push(req.body.symbol);
        let sql = 'UPDATE account SET star=? WHERE id=?';
        conn.query(sql, [JSON.stringify(star), decoded.phone], (err1, rows, fields) => {
            if(err1) return res.status(400).json({ result: false, err: err1, msg: err1 });
            res.status(200).json({ msg: '관심 종목에 추가되었습니다.\n어플 다시시작하면 적용이 됩니다.\n어플을 다시시작 하시겠습니까?' });
        });
    });
})
.post('/star/remove', (req, res) => {
    let token = req.cookies.user;
    jwt.verify(token, config.secret, (err, decoded) => {
        if(err) return res.status(400).json({ result: false, msg: err });
        let de = JSON.parse(decoded.definance);
        let star = JSON.parse(decoded.star);

        if(de.indexOf(req.body.symbol) !== -1) {
            de.splice(de.indexOf(req.body.symbol), 1);
            let sql = 'UPDATE account SET default_finance=? WHERE id=?';
            conn.query(sql, [JSON.stringify(de), decoded.phone], (err1, rows, fields) => {
                if(err1) return res.status(400).json({ result: false,  err: err1, msg: err1 });
                return res.status(200).json({ msg: '관심 종목에 제거되었습니다.\n어플을 다시시작하면 적용이 됩니다.\n어플을 다시시작 하시겠습니까?' });
            });
        } else if(star.indexOf(req.body.symbol) !== -1) {
            star.splice(star.indexOf(req.body.symbol), 1);
            let sql = 'UPDATE account SET star=? WHERE id=?';
            conn.query(sql, [JSON.stringify(star), decoded.phone], (err1, rows, fields) => {
                if(err1) return res.status(400).json({ result: false,  err: err1, msg: err1 });
                return res.status(200).json({ msg: '관심 종목에 제거되었습니다.\n어플을 다시시작하면 적용이 됩니다.\n어플을 다시시작 하시겠습니까?' });
            });
        } else {
            res.status(200).json({ msg: '현재 이 주식은 관심 종목에 있지 않습니다.', result: 'not' });
        }
    });
})

.post('/cookies/get', (req, res) => {
    let token = req.cookies.user;
    jwt.verify(token, config.secret, (err, decoded) => {
        if(err) return res.status(400).json({ err: err });
        res.status(200).json({ data: decoded });
    });
})

module.exports = router;

async function guess_finance(symbol, req, res) {
    async function lookup(kind) {
        return await yahooFinance.quote({
            symbols: [symbol + kind],
            modules: [ 'price', 'summaryDetail' ]
        }, function(err, quotes) {
            fName = symbol + kind;
            return quotes;
        });
    }
    let info;
    let fName;
    try {
        info = await lookup('.KS');
    } catch {
        info = await lookup('.KQ');
    }

    async function get_korea_name() {
        const response = await axios.get(`https://m.stock.naver.com/api/item/getOverallHeaderItem.nhn?code=${symbol}`)
        return response.data.result.nm;
    }
    info[fName]['korea_name'] = await get_korea_name();

    let market_price = info[fName].price.regularMarketPrice;
    market_price = Number(market_price.toFixed(2)).toLocaleString();
    if(market_price.indexOf('.') == -1 && market_price.length < 7) market_price = market_price + '.00';
    info[fName]["market_price"] = market_price;

    let market_change = info[fName].price.regularMarketChange;
    let color;
    market_change = Number(market_change.toFixed(2)).toLocaleString();
    if(Number(market_change.replace(',', '')) >= 0) color='green';
    else color='red';
    if(color == 'green') market_change = '+' + market_change;
    if(market_change.indexOf('.') && market_change.length < 5) market_change = market_change + '.00'
    info[fName]["market_change"] = market_change;

    console.log(info);
    return res.status(200).json({data: info, name: fName});
}

async function search(val) {
    let a;
    const getBreeds = async () => {
        return new Promise(async function(resolve, reject) {
            try {
                a = await axios.get(`https://ac.finance.naver.com/ac?_callback=window.__jindo_callback._0&q=${encodeURI(val)}&q_enc=euc-kr&t_koreng=1&st=111&r_lt=111`);
            } catch(err) {
                console.log(err + '\nerr_code:3');
            }
            resolve(a);
        });
    }
    return await getBreeds().then(data => { return data.data; });
}

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