const yahooFinance = require('yahoo-finance');

async function test() {
    let info = await yahooFinance.quote({
        symbols: ['SBUX'],
        modules: [ 'price', 'summaryDetail' ]
    }, function(err, quotes) {
        if(err) console.error(err);
        else {
            return quotes;
        }
    });
    return info
}

async function m() {
    console.log(await test());
    return 0; 
}
console.log(m());