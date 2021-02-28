let preview_gragh_serises = {};
let preview_graph_data = {};
let finances_data = {};

function get_pre_graph(symbols_data, colors_data) {
    for(let symbol_name of symbols_data) {
        let info = { symbols: symbol_name };
        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/chart/preview/');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = () => {
            if(xhr.status === 200 && xhr.readyState === 4) {
                let data = JSON.parse(xhr.responseText);
                let chart_ch = document.querySelector(`.f_${symbol_name.replace('.', '___')} > .chart`);
                chart_ch.removeChild(document.querySelector(`.f_${symbol_name.replace('.', '___')} .chart .loader`));
                var container = document.createElement('div');
                chart_ch.appendChild(container);

                var chart = LightweightCharts.createChart(container, {
                    width: 90,
                    height: 53,
                    rightPriceScale: {
                        visible: false,
                    },
                    leftPriceScale: {
                        visible: false,
                    },
                    timeScale: {
                        visible: false,
                        secondsVisible: true,
                    },
                    crosshair: {
                        horzLine: {
                            visible: false,
                        },
                        vertLine: {
                            visible: false,
                        },
                    },
                    layout: {
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                    },
                    grid: {
                        vertLines: {
                            color: 'rgba(0, 0, 0, 0)',
                        },
                        horzLines: {
                            color: 'rgba(0, 0, 0, 0)',
                        },
                    },
                    handleScroll: false,
                    handleScale: false
                });

                if(colors_data[symbol_name].color == 'red') {
                    preview_gragh_serises[symbol_name] = chart.addAreaSeries({
                        symbol: 'AAPL',
                        topColor: 'rgba(237 , 56, 46, 0.5)',
                        lineColor: 'rgba(237 , 56, 46, 1)',
                        bottomColor: 'rgba(237 , 56, 46, 0)',
                        lineWidth: 2,
                    });
                } else {
                    preview_gragh_serises[symbol_name] = chart.addAreaSeries({
                        symbol: 'AAPL',
                        topColor: 'rgba(76, 175, 80, 0.5)',
                        lineColor: 'rgba(76, 175, 80, 1)',
                        bottomColor: 'rgba(76, 175, 80, 0)',
                        lineWidth: 2,
                    });
                }

                preview_gragh_serises[symbol_name].setData(data[symbol_name].data);
                preview_graph_data[symbol_name] = data[symbol_name];
                    
                chart.timeScale().setVisibleRange({
                    from: data[symbol_name].from,
                    to: data[symbol_name].to
                });
                chart.timeScale().getVisibleLogicalRange({
                    from: 0.1,
                    to: data[symbol_name].data.length-1
                });
            }
        }
        xhr.send(JSON.stringify(info));
    }
}

function make_finance_preview(data, symbol_name) {
    let main = document.querySelector(".main");

    let m_div = document.createElement("div");
    m_div.classList.add(`f_${symbol_name.replace('.', '___')}`);
    m_div.onclick = () => { bottom_on(); }



    let name_div = document.createElement("div");
    name_div.classList.add("name");


    let main_name_div = document.createElement("div");
    main_name_div.classList.add("main_name");
    main_name_div.innerHTML = symbol_name;

    let long_name_div = document.createElement("div");
    long_name_div.classList.add("long_name");
    long_name_div.innerHTML = data.price.longName;

    name_div.appendChild(main_name_div);
    name_div.appendChild(long_name_div);

    m_div.appendChild(name_div);



    let chart_div = document.createElement("div");
    chart_div.classList.add("chart");

    let chart_loader = document.createElement("div");
    chart_loader.classList.add("loader");
    chart_loader.classList.add("chart_l")

    chart_div.appendChild(chart_loader);

    m_div.appendChild(chart_div);



    let price_status_div = document.createElement("div");
    price_status_div.classList.add("price_status");


    let market_price_div = document.createElement("div");
    market_price_div.classList.add("market_price");
    let market_price = data.price.regularMarketPrice;
    market_price = Number(market_price.toFixed(2)).toLocaleString();
    if(market_price.indexOf('.') == -1 && market_price.length < 7) market_price = market_price + '.00';
    market_price_div.innerHTML = market_price;

    let market_change_div = document.createElement("div");
    market_change_div.classList.add("market_change");
    let market_change = data.price.regularMarketChange;
    let color;
    market_change = Number(market_change.toFixed(2)).toLocaleString();
    if(market_change >= 0) { market_change_div.classList.add("price_green"); color='green'; }
    else { market_change_div.classList.add("price_red"); color='red' }
    if(color == 'green') market_change = '+' + market_change;
    if(market_change.indexOf('.') && market_change.length < 5) market_change = market_change + '.00'
    market_change_div.innerHTML = market_change;

    price_status_div.appendChild(market_price_div);
    price_status_div.appendChild(market_change_div);

    m_div.appendChild(price_status_div);

    main.appendChild(m_div);

    return { 'color': color };
}

function get_finance_info() {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/finance/');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4 && xhr.status === 200) {
            let data = JSON.parse(xhr.responseText);
            document.querySelector(".main").classList.remove("h200");
            let loader = document.querySelector(".loader");
            loader.parentNode.removeChild(loader);

            let symbols_data = [];
            let colors_data = {};

            if(data.star_status) {
                for(let i of data.star) {
                    colors_data[i] = make_finance_preview(data.data_star[i], i);
                    symbols_data.push(i);
                    finances_data[i] = data.data_star[i];
                }
            }
            if(data.definance_status) {
                for(let i of data.definance) {
                    colors_data[i] = make_finance_preview(data.data_definance[i], i);
                    symbols_data.push(i);
                    finances_data[i] = data.data_definance[i];
                }
            }
            if(data.view_status) {
                for(let i of data.view) {
                    colors_data[i] = make_finance_preview(data.data_view[i], i);
                    symbols_data.push(i);
                    finances_data[i] = data.data_view[i];
                }
            }

            if(symbols_data.length > 0) {
                get_pre_graph(symbols_data, colors_data);
            }
        }
    }
    xhr.send(null);
}