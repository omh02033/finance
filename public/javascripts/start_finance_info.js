let preview_gragh_serises = {};
let preview_graph_data = {};
let finances_data = {};
let bottom_graph_serises;

function get_pre_graph(symbols_data, colors_data) {
    for(let symbol_name of symbols_data) {
        let info = { symbols: symbol_name };
        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/chart/preview/');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = () => {
            if(xhr.status === 200 && xhr.readyState === 4) {
                let data = JSON.parse(xhr.responseText);

                // main preview graph setting
                let chart_ch = document.querySelector(`.main .f_${symbol_name.replace('.', '___')} > .chart`);
                chart_ch.removeChild(document.querySelector(`.main .f_${symbol_name.replace('.', '___')} .chart .loader`));
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


                // bottoming top preview graph setting
                let b_chart_ch = document.querySelector(`.on_bottom_top .b_${symbol_name.replace('.', '___')} > .bottom_top_right`);
                var b_container = document.createElement('div');
                b_chart_ch.appendChild(b_container);

                var b_chart = LightweightCharts.createChart(b_container, {
                    width: 60,
                    height: 50,
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

                let bottoming_preview_graph;

                if(colors_data[symbol_name].color == 'red') {
                    bottoming_preview_graph = b_chart.addAreaSeries({
                        symbol: 'AAPL',
                        topColor: 'rgba(237 , 56, 46, 0.5)',
                        lineColor: 'rgba(237 , 56, 46, 1)',
                        bottomColor: 'rgba(237 , 56, 46, 0)',
                        lineWidth: 2,
                    });
                } else {
                    bottoming_preview_graph = b_chart.addAreaSeries({
                        symbol: 'AAPL',
                        topColor: 'rgba(76, 175, 80, 0.5)',
                        lineColor: 'rgba(76, 175, 80, 1)',
                        bottomColor: 'rgba(76, 175, 80, 0)',
                        lineWidth: 2,
                    });
                }

                bottoming_preview_graph.setData(data[symbol_name].data);
                    
                b_chart.timeScale().setVisibleRange({
                    from: data[symbol_name].from,
                    to: data[symbol_name].to
                });
                b_chart.timeScale().getVisibleLogicalRange({
                    from: 0.1,
                    to: data[symbol_name].data.length-1
                });
            } else if(xhr.readyState === 4 && xhr.status === 501) {
                let data = JSON.parse(xhr.responseText);
                alert(`${data.msg}\n잠시후에 다시시작 해주세요.`);
            }
        }
        xhr.send(JSON.stringify(info));
    }
}

function make_finance_preview(data, symbol_name) {
    // main preview setting
    let main = document.querySelector(".main");

    let m_div = document.createElement("div");
    m_div.classList.add(`f_${symbol_name.replace('.', '___')}`);
    m_div.onclick = function() { bottom_on(this); }



    let name_div = document.createElement("div");
    name_div.classList.add("name");


    let main_name_div = document.createElement("div");
    main_name_div.classList.add("main_name");
    main_name_div.innerHTML = data.korea_name;

    let long_name_div = document.createElement("div");
    long_name_div.classList.add("long_name");
    long_name_div.innerHTML = symbol_name;

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
    finances_data[symbol_name]["market_price"] = market_price;

    let market_change_div = document.createElement("div");
    market_change_div.classList.add("market_change");
    let market_change = data.price.regularMarketChange;
    let color;
    market_change = Number(market_change.toFixed(2)).toLocaleString();
    if(Number(market_change.replace(',', '')) >= 0) { market_change_div.classList.add("price_green"); color='green'; }
    else { market_change_div.classList.add("price_red"); color='red' }
    if(color == 'green') market_change = '+' + market_change;
    if(market_change.indexOf('.') && market_change.length < 5) market_change = market_change + '.00'
    market_change_div.innerHTML = market_change;
    finances_data[symbol_name]["market_change"] = market_change;

    price_status_div.appendChild(market_price_div);
    price_status_div.appendChild(market_change_div);

    m_div.appendChild(price_status_div);

    main.appendChild(m_div);


    // bottoming preview setting
    let on_bottom_top = document.querySelector(".on_bottom_top");

    let b_div = document.createElement("div");
    b_div.classList.add(`b_${symbol_name.replace('.', '___')}`);

    let bottom_top_left = document.createElement("div");
    bottom_top_left.classList.add("bottom_top_left");


    let btl_main_name = document.createElement("div");
    btl_main_name.classList.add("btl_main_name");
    btl_main_name.innerHTML = data.korea_name;
    bottom_top_left.appendChild(btl_main_name);

    let btl_market_price = document.createElement("div");
    btl_market_price.classList.add("btl_market_price");
    btl_market_price.innerHTML = market_price;
    bottom_top_left.appendChild(btl_market_price);

    let btl_market_change = document.createElement("div");
    btl_market_change.classList.add("btl_market_change");
    if(color == 'green') { btl_market_change.style.color = "#35c759"; }
    else { btl_market_change.style.color = "#ff3a30"; }
    btl_market_change.innerHTML = market_change;
    bottom_top_left.appendChild(btl_market_change);

    b_div.appendChild(bottom_top_left);


    let bottom_top_right = document.createElement("div");
    bottom_top_right.classList.add("bottom_top_right");

    b_div.appendChild(bottom_top_right);

    on_bottom_top.appendChild(b_div)

    return { 'color': color };
}

function get_finance_info() {
    let g_bar = document.querySelector(".bar");
    let g_status = document.querySelector(".g_status");
    g_bar.style.width = "25%";
    let status = 0;
    let p = setInterval(()=>{
        status += 1;
        g_status.innerHTML = `${status}%`;
        if(status >= 25) {
            clearInterval(p);
        }
    }, 10);
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/finance/');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        g_bar.style.width = `${xhr.readyState*25}%`;
        let p1 = setInterval(() => {
            g_status.innerHTML = `${status}%`;
            if(status >= xhr.readyState*25) {
                console.log("a");
                console.log(status);
                console.log(xhr.readyState*25);
                clearInterval(p1);
            }
            if(status >= 100) {
                g_status.innerHTML = '100%';
                clearInterval(p1);
            }
            status += 1;
        }, 10);
        if(xhr.readyState === 4 && xhr.status === 200) {
            // clearInterval(p1);
            // g_status.innerHTML = "100%";
            let data = JSON.parse(xhr.responseText);
            // let loader = document.querySelector(".loader");
            // loader.parentNode.removeChild(loader);
            let gauge = document.querySelector(".gauge");
            setTimeout(()=>{
                document.querySelector(".main").classList.remove("h200");
                gauge.parentNode.removeChild(gauge);
                g_status.parentNode.removeChild(g_status);
                let symbols_data = [];
                let colors_data = {};
    
                if(data.star_status) {
                    for(let i of data.star) {
                        finances_data[i] = data.data_star[i];
                        colors_data[i] = make_finance_preview(data.data_star[i], i);
                        symbols_data.push(i);
                    }
                }
                if(data.definance_status) {
                    for(let i of data.definance) {
                        finances_data[i] = data.data_definance[i];
                        colors_data[i] = make_finance_preview(data.data_definance[i], i);
                        symbols_data.push(i);
                    }
                }
    
                if(symbols_data.length > 0) {
                    get_pre_graph(symbols_data, colors_data);
                }
                roll_start(Object.keys(finances_data).length);
            }, 800);

        } else if(xhr.readyState === 4 && xhr.status === 501) {
            let data = JSON.parse(xhr.responseText);
            alert(`${data.msg}\n잠시후에 다시시작 해주세요.`);
        }
    }
    xhr.send(null);
}