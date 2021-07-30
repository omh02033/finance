var bannerLeft=0;
var first=1;
var last;
var imgCnt=0;
var $img;
var $first;
var $last;
function bottom_top_roll() {
    $img.each(function(){
        $(this).css("left", $(this).position().left-1); // 1px씩 왼쪽으로 이동
    });
    $first = $("#banner"+first);
    $last = $("#banner"+last);
    if($first.position().left < -200) {    // 제일 앞에 배너 제일 뒤로 옮김
        $first.css("left", $last.position().left + $last.width()+130 );
        first++;
        last++;
        if(last > imgCnt) { last=1; }   
        if(first > imgCnt) { first=1; }
    }
}

let roll_s;

let botto = document.querySelector(".bottom");
let on_bottom_top = document.querySelector(".on_bottom_top");
let star = document.querySelector(".star");

star.ontouchend = function () {
    let info = {
        symbol: this.classList[2].replace('___', '.').substring(2)
    }
    let xhr = new XMLHttpRequest();
    if(this.classList[1] == 'new') {
        xhr.open('POST', '/star/add/');
    } else if(this.classList[1] == 'gr') {
        xhr.open('POST', '/star/remove/');
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = () => {
        if(xhr.status == 200 && xhr.readyState === 4) {
            let data = JSON.parse(xhr.responseText);
            if(data.result == 'not') {
                alert(data.msg);
                location.replace(location.href);
            } else {
                let a = confirm(data.msg);
                if(a) location.replace(location.href);
            }
        } else if(xhr.readyState === 4 && xhr.status === 501) {
            let data = JSON.parse(xhr.responseText);
            alert(`${data.msg}\n잠시후에 다시시작 해주세요.`);
        }
    }
    xhr.send(JSON.stringify(info));
}

function bottom_on(dv) {
    roll_s = setInterval(bottom_top_roll, 70);
    top_explain.classList.remove("exdn");
    top_explain.classList.remove("exdb");
    top_explain.classList.add("exdn");
    searchb.classList.remove("exdn");
    searchb.classList.remove("exdb");
    searchb.classList.remove("dn");
    searchb.classList.add("exdn");
    searchb.classList.add("dn");
    botto.classList.remove("on");
    botto.classList.remove("off");
    botto.classList.add("on");
    on_bottom_top.classList.remove("odn");
    on_bottom_top.classList.remove("odf");
    on_bottom_top.classList.add("odf");
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/cookies/get');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = () => {
        if(xhr.status == 200 && xhr.readyState === 4) {
            let info = JSON.parse(xhr.responseText);
            let my_cookie = info.data;
            let de = my_cookie.definance;
            let star_finance = my_cookie.star;
            if(de.indexOf(dv.className.replace('___', '.').substring(2)) !== -1 || star_finance.indexOf(dv.className.replace('___', '.').substring(2)) !== -1) {
                star.classList.remove(star.classList[2]);
                star.classList.remove("gr");
                star.classList.remove("new");
                star.classList.add("gr");
                star.classList.add(dv.className);
                star.innerHTML = '관심 종목에 제거';
            } else {
                star.classList.remove(star.classList[2]);
                star.classList.remove("gr");
                star.classList.remove("new");
                star.classList.add("new");
                star.classList.add(dv.className);
                star.innerHTML = '관심 종목에 추가';
            }
        } else if(xhr.readyState === 4 && xhr.status === 501) {
            let data = JSON.parse(xhr.responseText);
            alert(`${data.msg}\n잠시후에 다시시작 해주세요.`);
        }
    }
    xhr.send();
    let color = dv.childNodes[2].childNodes[1].classList[1].split('_')[1];
    set_finance_data(dv, color);
    bottom_graph_set(dv.className.replace('___', '.').substring(2), color);
}

function bottom_down() {
    if(roll_s) clearInterval(roll_s);
    top_explain.classList.remove("exdn");
    top_explain.classList.remove("exdb");
    top_explain.classList.add("exdb");
    searchb.classList.remove("exdn");
    searchb.classList.remove("exdb");
    searchb.classList.remove("dn");
    searchb.classList.add("exdb");
    botto.classList.remove("on");
    botto.classList.remove("off");
    botto.classList.add("off");
    on_bottom_top.classList.remove("odn");
    on_bottom_top.classList.remove("odf");
    on_bottom_top.classList.add("odn");
}

function set_finance_data(dv, color) {
    let f_name = dv.className.replace('___', '.').substring(2);
    let main_name = document.querySelector(".bottom_main_name .main_name");
    main_name.innerHTML = finances_data[f_name].korea_name;

    let long_name = document.querySelector(".bottom_main_name .long_name");
    long_name.innerHTML = finances_data[f_name].price.longName;

    let market_price = document.querySelector(".bottom_price_change .bottom_market_price");
    market_price.innerHTML = finances_data[f_name].market_price;

    let market_change = document.querySelector(".bottom_price_change .bottom_market_change");
    market_change.classList.remove("price_green");
    market_change.classList.remove("price_red");
    if(color == 'green') {
        market_change.classList.add("price_green");
    } else {
        market_change.classList.add("price_red");
    }
    market_change.innerHTML = finances_data[f_name].market_change;

    let MarketOpen = document.getElementById("MarketOpen");
    let MarketDayHigh = document.getElementById("MarketDayHigh");
    let MarketDayLow = document.getElementById("MarketDayLow");
    let MarketVolume = document.getElementById("MarketVolume");
    let trailingPE = document.getElementById("trailingPE");
    let marketCap = document.getElementById("marketCap");
    let fiftyTwoWeekHigh = document.getElementById("fiftyTwoWeekHigh");
    let fiftyTwoWeekLow = document.getElementById("fiftyTwoWeekLow");
    let averageVolume = document.getElementById("averageVolume");
    let dividendYield = document.getElementById("dividendYield");
    let beta = document.getElementById("beta");

    function getNum(kind, val) {
        if(kind == 'P') {
            if(String(val).length > 12 && val > 0) {
                val = val / 1000000000000;
                val = val.toFixed(2) + "조";
            } else if(String(val).length > 8 && val > 0) {
                val = val / 100000000;
                val = val.toFixed(1) + "억";
            } else if(String(val).length > 6 && val > 0) {
                val = val / 10000;
                val = val.toFixed(1) + "만";
            } else if(String(val).length < 6 && val > 0) {
                val = val.toLocaleString() + ".00";
            } else if(val > 0) {
                val = val.toLocaleString();
            }
        } else if(kind == 'B') {
            val = val * 100
            val = val.toFixed(2) + "%";
        }
        return val;
    }

    if(finances_data[f_name].price.regularMarketOpen)
        MarketOpen.innerHTML = getNum('P', finances_data[f_name].price.regularMarketOpen);
    else MarketOpen.innerHTML = '-';
    if(finances_data[f_name].price.regularMarketDayHigh)
        MarketDayHigh.innerHTML = getNum('P', finances_data[f_name].price.regularMarketDayHigh);
    else MarketDayHigh.innerHTML = '-';
    if(finances_data[f_name].price.regularMarketDayLow)
        MarketDayLow.innerHTML = getNum('P', finances_data[f_name].price.regularMarketDayLow);
    else MarketDayLow.innerHTML = '-';
    if(finances_data[f_name].price.regularMarketVolume) 
        MarketVolume.innerHTML = getNum('P', finances_data[f_name].price.regularMarketVolume);
    else MarketVolume.innerHTML = '-';
    if(finances_data[f_name].summaryDetail.trailingPE)
        trailingPE.innerHTML = getNum('P', finances_data[f_name].summaryDetail.trailingPE);
    else trailingPE.innerHTML = '-';
    if(finances_data[f_name].price.marketCap)
        marketCap.innerHTML = getNum('P', finances_data[f_name].price.marketCap);
    else marketCap.innerHTML = '-';
    if(finances_data[f_name].summaryDetail.fiftyTwoWeekHigh)
        fiftyTwoWeekHigh.innerHTML = getNum('P', finances_data[f_name].summaryDetail.fiftyTwoWeekHigh);
    else fiftyTwoWeekHigh.innerHTML = '-';
    if(finances_data[f_name].summaryDetail.fiftyTwoWeekLow)
        fiftyTwoWeekLow.innerHTML = getNum('P', finances_data[f_name].summaryDetail.fiftyTwoWeekLow);
    else fiftyTwoWeekLow.innerHTML = '-';
    if(finances_data[f_name].summaryDetail.averageVolume)
        averageVolume.innerHTML = getNum('P', finances_data[f_name].summaryDetail.averageVolume);
    else averageVolume.innerHTML = '-';
    if(finances_data[f_name].summaryDetail.dividendYield)
        dividendYield.innerHTML = getNum('B', finances_data[f_name].summaryDetail.dividendYield);
    else dividendYield.innerHTML = '-';
    if(finances_data[f_name].summaryDetail.beta)
        beta.innerHTML = finances_data[f_name].summaryDetail.beta.toFixed(2);
    else beta.innerHTML = '-';
}

function bottom_fast(fName, color) {
    let bottom_graph = document.querySelector(".bottom_graph");
    let xhr = new XMLHttpRequest();
    xhr.open('POST', `/chart/bottom/fast/${fName}`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = () => {
        if(xhr.status == 200 && xhr.readyState === 4) {
            let data = JSON.parse(xhr.responseText);
            while(bottom_graph.hasChildNodes()) {
                bottom_graph.removeChild(bottom_graph.firstChild);
            }
            function createSimpleSwitcher(items, activeItem, activeItemChangedCallback) {
                var switcherElement = document.createElement('div');
                switcherElement.classList.add('switcher');

                var intervalElements = items.map(function(item) {
                    var itemEl = document.createElement('button');
                    itemEl.innerText = item;
                    itemEl.classList.add('switcher-item');
                    itemEl.classList.toggle('switcher-active-item', item === activeItem);
                    itemEl.addEventListener('touchend', function() {
                        onItemClicked(item);
                    });
                    switcherElement.appendChild(itemEl);
                    let loader = document.createElement("div");
                    loader.classList.add('loader');
                    loader.classList.add('dbtn')
                    switcherElement.appendChild(loader);
                    return itemEl;
                });

                function onItemClicked(item) {
                    if (item === activeItem) {
                        return;
                    }

                    intervalElements.forEach(function(element, index) {
                        element.classList.toggle('switcher-active-item', items[index] === item);
                    });

                    activeItem = item;

                    activeItemChangedCallback(item);
                }

                return switcherElement;
            }

            var intervals = ['1일'];

            let _1dayData = [];
            for(let j in data.data[intervals[0]][0].timestamp) {
                if(!data.data[intervals[0]][0].indicators.quote[0].close[j]) continue;
                _1dayData.push({ 'time': data.data[intervals[0]][0].timestamp[j], 'value': Number(data.data[intervals[0]][0].indicators.quote[0].close[j].toFixed(2)) });
            }

            var seriesesData = new Map([
                ['1일', _1dayData ]
            ]);

            var switcherElement = createSimpleSwitcher(intervals, intervals[0], syncToInterval);

            var chartElement = document.createElement('div');

            var chart = LightweightCharts.createChart(chartElement, {
                width: screen.width,
                height: 250,
                layout: {
                    backgroundColor: '#1c1c1d',
                    textColor: '#d1d4dc',
                },
                grid: {
                    vertLines: {
                        visible: false,
                    },
                    horzLines: {
                        color: 'rgba(42, 46, 57, 0.5)',
                    },
                },
                rightPriceScale: {
                    borderVisible: false,
                },
                timeScale: {
                    borderVisible: false,
                },
                crosshair: {
                    horzLine: {
                        visible: false,
                    },
                },
                handleScroll: {
                    mouseWhill: true,
                    pressedMouseMove: true,
                    horzTouchDrag: true,
                    vertTouchDrag: false
                },
                handleScals: false,
                timeScale: {
                    fixLeftEdge: true
                }
            });

            bottom_graph.appendChild(switcherElement);
            bottom_graph.appendChild(chartElement);

            var areaSeries = null;

            function syncToInterval(interval) {
                if (areaSeries) {
                    chart.removeSeries(areaSeries);
                    areaSeries = null;
                }
                if(color == 'green') {
                    areaSeries = chart.addAreaSeries({
                    topColor: 'rgba(76, 175, 80, 0.56)',
                    bottomColor: 'rgba(76, 175, 80, 0.04)',
                    lineColor: 'rgba(76, 175, 80, 1)',
                    lineWidth: 2,
                    });
                } else {
                    areaSeries = chart.addAreaSeries({
                    topColor: 'rgba(237 , 56, 46, 0.5)',
                    lineColor: 'rgba(237 , 56, 46, 1)',
                    bottomColor: 'rgba(237 , 56, 46, 0)',
                    lineWidth: 2,
                    });
                }
                areaSeries.setData(seriesesData.get(interval));
            }

            syncToInterval(intervals[0]);

            chart.timeScale().setVisibleRange({
                from: data.data[intervals[0]][0].meta.tradingPeriods[0][0].start,
                to: data.data[intervals[0]][0].meta.tradingPeriods[0][0].end
            });
        } else if(xhr.readyState === 4 && xhr.status === 501) {
            let data = JSON.parse(xhr.responseText);
            alert(`${data.msg}\n잠시후에 다시시작 해주세요.`);
        }
    }
    xhr.send()
}

function bottom_graph_set(fName, color) {
    let bottom_graph = document.querySelector('.bottom_graph');
    while(bottom_graph.hasChildNodes()) {
        bottom_graph.removeChild(bottom_graph.firstChild);
    }
    let loader = document.createElement("div");
    loader.classList.add("loader");
    bottom_graph.appendChild(loader);
    bottom_fast(fName, color);
    let xhr = new XMLHttpRequest();
    xhr.open('POST', `/chart/bottom/${fName}`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = () => {
        if(xhr.status === 200 && xhr.readyState === 4) {
            let data = JSON.parse(xhr.responseText);
            while(bottom_graph.hasChildNodes()) {
                bottom_graph.removeChild(bottom_graph.firstChild);
            }
            function createSimpleSwitcher(items, activeItem, activeItemChangedCallback) {
                var switcherElement = document.createElement('div');
                switcherElement.classList.add('switcher');

                var intervalElements = items.map(function(item) {
                    var itemEl = document.createElement('button');
                    itemEl.innerText = item;
                    itemEl.classList.add('switcher-item');
                    itemEl.classList.toggle('switcher-active-item', item === activeItem);
                    itemEl.addEventListener('touchend', function() {
                        onItemClicked(item);
                    });
                    switcherElement.appendChild(itemEl);
                    return itemEl;
                });

                function onItemClicked(item) {
                    if (item === activeItem) {
                        return;
                    }

                    intervalElements.forEach(function(element, index) {
                        element.classList.toggle('switcher-active-item', items[index] === item);
                    });

                    activeItem = item;

                    function change_timescale(idx) {
                        chart.timeScale().setVisibleRange({
                            from: data.data[intervals[idx]][0].timestamp[0],
                            to: data.data[intervals[idx]][0].timestamp[data.data[intervals[idx]][0].timestamp.length-1]
                        });
                        chart.timeScale().setVisibleLogicalRange({
                            from: 1,
                            to: data.data[intervals[idx]][0].timestamp.length-1
                        });
                    }

                    if(item == '1일') {
                        change_timescale(0);
                    } else if(item == '5일') {
                        change_timescale(1);
                    } else if(item == '1달') {
                        change_timescale(2);
                    } else if(item == '3달') {
                        change_timescale(3);
                    } else if(item == '6달') {
                        change_timescale(4);
                    } else if(item == '1년') {
                        change_timescale(5);
                    } else if(item == '2년') {
                        change_timescale(6);
                    } else if(item == '5년') {
                        change_timescale(7);
                    } else if(item == '10년') {
                        change_timescale(8);
                    }

                    activeItemChangedCallback(item);
                }

                return switcherElement;
            }

            var intervals = ['1일', '5일', '1달', '3달', '6달', '1년', '2년', '5년', '10년'];

            let _1dayData = [];
            for(let j in data.data[intervals[0]][0].timestamp) {
                if(!data.data[intervals[0]][0].indicators.quote[0].close[j]) continue;
                _1dayData.push({ 'time': data.data[intervals[0]][0].timestamp[j], 'value': Number(data.data[intervals[0]][0].indicators.quote[0].close[j].toFixed(2)) });
            }

            let _5dayData = [];
            if(data.data[intervals[1]] != null) {
                for(let j in data.data[intervals[1]][0].timestamp) {
                    if(!data.data[intervals[1]][0].indicators.quote[0].close[j]) continue;
                    _5dayData.push({ 'time': data.data[intervals[1]][0].timestamp[j], 'value': Number(data.data[intervals[1]][0].indicators.quote[0].close[j].toFixed(2)) });
                }
            }

            let _1monthData = [];
            if(data.data[intervals[2]] != null) {
                for(let j in data.data[intervals[2]][0].timestamp) {
                    if(!data.data[intervals[2]][0].indicators.quote[0].close[j]) continue;
                    _1monthData.push({ 'time': data.data[intervals[2]][0].timestamp[j], 'value': Number(data.data[intervals[2]][0].indicators.quote[0].close[j].toFixed(2)) });
                }
            }

            let _3monthData = [];
            if(data.data[intervals[3]] != null) {
                for(let j in data.data[intervals[3]][0].timestamp) {
                    if(!data.data[intervals[3]][0].indicators.quote[0].close[j]) continue;
                    _3monthData.push({ 'time': data.data[intervals[3]][0].timestamp[j], 'value': Number(data.data[intervals[3]][0].indicators.quote[0].close[j].toFixed(2)) });
                }
            }

            let _6monthData = [];
            if(data.data[intervals[4]] != null) {
                for(let j in data.data[intervals[4]][0].timestamp) {
                    if(!data.data[intervals[4]][0].indicators.quote[0].close[j]) continue;
                    _6monthData.push({ 'time': data.data[intervals[4]][0].timestamp[j], 'value': Number(data.data[intervals[4]][0].indicators.quote[0].close[j].toFixed(2)) });
                }
            }

            let _1yearData = [];
            if(data.data[intervals[5]] != null) {
                for(let j in data.data[intervals[5]][0].timestamp) {
                    if(!data.data[intervals[5]][0].indicators.quote[0].close[j]) continue;
                    _1yearData.push({ 'time': data.data[intervals[5]][0].timestamp[j], 'value': Number(data.data[intervals[5]][0].indicators.quote[0].close[j].toFixed(2)) });
                }
            }

            let _2yearData = [];
            if(data.data[intervals[6]] != null) {
                for(let j in data.data[intervals[6]][0].timestamp) {
                    if(!data.data[intervals[6]][0].indicators.quote[0].close[j]) continue;
                    _2yearData.push({ 'time': data.data[intervals[6]][0].timestamp[j], 'value': Number(data.data[intervals[6]][0].indicators.quote[0].close[j].toFixed(2)) });
                }
            }

            let _5yearData = [];
            if(data.data[intervals[7]] != null) {
                for(let j in data.data[intervals[7]][0].timestamp) {
                    if(!data.data[intervals[7]][0].indicators.quote[0].close[j]) continue;
                    _5yearData.push({ 'time': data.data[intervals[7]][0].timestamp[j], 'value': Number(data.data[intervals[7]][0].indicators.quote[0].close[j].toFixed(2)) });
                }
            }

            let _10yearData = [];
            if(data.data[intervals[8]] != null) {
                for(let j in data.data[intervals[8]][0].timestamp) {
                    if(!data.data[intervals[8]][0].indicators.quote[0].close[j]) continue;
                    _10yearData.push({ 'time': data.data[intervals[8]][0].timestamp[j], 'value': Number(data.data[intervals[8]][0].indicators.quote[0].close[j].toFixed(2)) });
                }
            }

            var seriesesData = new Map([
                ['1일', _1dayData ],
                ['5일', _5dayData ],
                ['1달', _1monthData ],
                ['3달', _3monthData ],
                ['6달', _6monthData ],
                ['1년', _1yearData ],
                ['2년', _2yearData ],
                ['5년', _5yearData ],
                ['10년', _10yearData ],
            ]);

            var switcherElement = createSimpleSwitcher(intervals, intervals[0], syncToInterval);

            var chartElement = document.createElement('div');

            var chart = LightweightCharts.createChart(chartElement, {
                width: screen.width,
                height: 250,
                layout: {
                    backgroundColor: '#1c1c1d',
                    textColor: '#d1d4dc',
                },
                grid: {
                    vertLines: {
                        visible: false,
                    },
                    horzLines: {
                        color: 'rgba(42, 46, 57, 0.5)',
                    },
                },
                rightPriceScale: {
                    borderVisible: false,
                },
                timeScale: {
                    borderVisible: false,
                },
                crosshair: {
                    horzLine: {
                        visible: false,
                    },
                },
                handleScroll: {
                    mouseWhill: true,
                    pressedMouseMove: true,
                    horzTouchDrag: true,
                    vertTouchDrag: false
                },
                handleScals: false,
                timeScale: {
                    fixLeftEdge: true,
                    secondsVisible: true
                },
                localization: {
                    dateFormat: 'yyyy/MM/dd'
                }
            });

            bottom_graph.appendChild(switcherElement);
            bottom_graph.appendChild(chartElement);

            var areaSeries = null;

            function syncToInterval(interval) {
                if (areaSeries) {
                    chart.removeSeries(areaSeries);
                    areaSeries = null;
                }
                if(color == 'green') {
                    areaSeries = chart.addAreaSeries({
                    topColor: 'rgba(76, 175, 80, 0.56)',
                    bottomColor: 'rgba(76, 175, 80, 0.04)',
                    lineColor: 'rgba(76, 175, 80, 1)',
                    lineWidth: 2,
                    });
                } else {
                    areaSeries = chart.addAreaSeries({
                    topColor: 'rgba(237 , 56, 46, 0.5)',
                    lineColor: 'rgba(237 , 56, 46, 1)',
                    bottomColor: 'rgba(237 , 56, 46, 0)',
                    lineWidth: 2,
                    });
                }
                areaSeries.setData(seriesesData.get(interval));
            }

            syncToInterval(intervals[0]);
            
            chart.timeScale().setVisibleRange({
                from: data.data[intervals[0]][0].meta.tradingPeriods[0][0].start,
                to: data.data[intervals[0]][0].meta.tradingPeriods[0][0].end
            });
        } else if(xhr.readyState === 4 && xhr.status === 501) {
            let data = JSON.parse(xhr.responseText);
            alert(`${data.msg}\n잠시후에 다시시작 해주세요.`);
        }
    }
    xhr.send();
}

function search_bottom_on(dv) {
    let info = {
        symbol: dv.className.substring(2)
    }
    let xhr = new XMLHttpRequest();
    xhr.open('POST', `/chart/guess/`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = () => {
        if(xhr.status == 200 && xhr.readyState === 4) {
            search_blur();
            let data = JSON.parse(xhr.responseText);
            finances_data[data.name] = data.data[data.name];
            dv.className = "f_" + data.name.replace('.', '___');
            roll_s = setInterval(bottom_top_roll, 70);
            top_explain.classList.remove("exdn");
            top_explain.classList.remove("exdb");
            top_explain.classList.add("exdn");
            searchb.classList.remove("exdn");
            searchb.classList.remove("exdb");
            searchb.classList.add("exdn");
            botto.classList.remove("on");
            botto.classList.remove("off");
            botto.classList.add("on");
            on_bottom_top.classList.remove("odn");
            on_bottom_top.classList.remove("odf");
            on_bottom_top.classList.add("odf");
            let xhr1 = new XMLHttpRequest();
            xhr1.open('POST', '/cookies/get');
            xhr1.setRequestHeader('Content-Type', 'application/json');
            xhr1.onreadystatechange = () => {
                if(xhr1.status == 200 && xhr1.readyState === 4) {
                    let info = JSON.parse(xhr1.responseText);
                    let my_cookie = info.data;
                    let de = my_cookie.definance;
                    let star_finance = my_cookie.star;
                    if(de.indexOf(dv.className.replace('___', '.').substring(2)) !== -1 || star_finance.indexOf(dv.className.replace('___', '.').substring(2)) !== -1) {
                        star.classList.remove(star.classList[2]);
                        star.classList.remove("gr");
                        star.classList.remove("new");
                        star.classList.add("gr");
                        star.classList.add(dv.className);
                        star.innerHTML = '관심 종목에 제거';
                    } else {
                        star.classList.remove(star.classList[2]);
                        star.classList.remove("gr");
                        star.classList.remove("new");
                        star.classList.add("new");
                        star.classList.add(dv.className);
                        star.innerHTML = '관심 종목에 추가';
                    }
                }
            }
            xhr1.send();
            let color;
            if(finances_data[data.name].market_change[0] == "+") color = 'green';
            else color = 'red';
            set_finance_data(dv, color);
            bottom_graph_set(dv.className.replace('___', '.').substring(2), color);
        } else if(xhr.readyState === 4 && xhr.status === 501) {
            let data = JSON.parse(xhr.responseText);
            alert(`${data.msg}\n잠시후에 다시시작 해주세요.`);
        }
    }
    xhr.send(JSON.stringify(info));
}

let startY, endY;
let y1, y2;
let cancel_status = false;
let bottom_graph = document.querySelector(".bottom_graph");

botto.addEventListener("touchstart", (e) => {
    if(e.target !== e.currentTarget) if(e.target.tagName == 'CANVAS') return; else if(e.target.className.indexOf('info') !== -1 || e.target.className.indexOf('switch') !== -1) return;
    if(!cancel_status) {
        e.preventDefault();
        startY = e.changedTouches[0].screenY;
        y1 = e.changedTouches[0].pageY;
        botto.classList.remove("on");
        botto.style.transform = "translateY(72px)";
    }
});
botto.addEventListener("touchmove", (e) => {
    if(e.target !== e.currentTarget) if(e.target.tagName == 'CANVAS') return; else if(e.target.className.indexOf('info') !== -1 || e.target.className.indexOf('switch') !== -1) return;
    if(!cancel_status) {
        if(y1 - e.changedTouches[0].pageY > 0) {
            e.preventDefault();
        } else {
            y2 = y1 - e.changedTouches[0].pageY;
            botto.style.transform = `translateY(${72 - y2}px)`;
        }
    }
});
botto.addEventListener("touchend", (e) => {
    if(e.target !== e.currentTarget) if(e.target.tagName == 'CANVAS') return; else if(e.target.className.indexOf('info') !== -1 || e.target.className.indexOf('switch') !== -1) return;
    if(!cancel_status) {
        endY = e.changedTouches[0].screenY;
        if((endY - startY) < 75) {
            botto.classList.add("on");
            botto.style.transform = "translateY(72px)";
        } else bottom_down();
    }
});

let bottom_close_button = document.getElementById("bottom_close_button");
bottom_close_button.ontouchend = () => {
    bottom_down();
}

function roll_start(finances_length) {
    $img = $(".on_bottom_top > div");

    $img.each(function(){   // 5px 간격으로 배너 처음 위치 시킴
        $(this).css("left",bannerLeft);
        bannerLeft += $(this).width()+30;
        $(this).attr("id", "banner"+(++imgCnt));  // img에 id 속성 추가
    });

    if(imgCnt > finances_length-1) {
        last = imgCnt;
    }
}