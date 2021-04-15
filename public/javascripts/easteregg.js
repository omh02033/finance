function dimigo_bottom_on(dv) {
    search_blur();
    finances_data[data.name] = data.data[data.name];
    dv.className = "f_dimigo";
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
    let color;
    color = 'red';
    set_finance_data_dimigo(color);
    bottom_graph_set_dimigo(color);
}

function set_finance_data(color) {
    let main_name = document.querySelector(".bottom_main_name .main_name");
    main_name.innerHTML = '디미파이';

    let long_name = document.querySelector(".bottom_main_name .long_name");
    long_name.innerHTML = 'Korea Digital Media High School DimiFi';

    let market_price = document.querySelector(".bottom_price_change .bottom_market_price");
    market_price.innerHTML = '16 Mbps';

    let market_change = document.querySelector(".bottom_price_change .bottom_market_change");
    market_change.classList.remove("price_green");
    market_change.classList.remove("price_red");
    market_change.classList.add("price_red");
    market_change.innerHTML = '-900 Mbps';

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

    MarketOpen.innerHTML = '너무 느림';
    MarketDayHigh.innerHTML = '너무 느림';
    MarketDayLow.innerHTML = '너무 느림';
    MarketVolume.innerHTML = '너무 느림';
    trailingPE.innerHTML = '너무 느림';
    marketCap.innerHTML = '너무 느림';
    fiftyTwoWeekHigh.innerHTML = '너무 느림';
    fiftyTwoWeekLow.innerHTML = '너무 느림';
    averageVolume.innerHTML = '너무 느림';
    dividendYield.innerHTML = '너무 느림';
    beta.innerHTML = '너무 느림';
}

function bottom_graph_set(color) {
    let bottom_graph = document.querySelector('.bottom_graph');
    while(bottom_graph.hasChildNodes()) {
        bottom_graph.removeChild(bottom_graph.firstChild);
    }
    let loader = document.createElement("div");
    loader.classList.add("loader");
    bottom_graph.appendChild(loader);
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
        }

        return switcherElement;
    }

    var intervals = ['1일'];

    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let date = today.getDate();
    let _1dayData = [
        { 'time': `${year}-${month}-${date} 01:00:00`, value: 900 },
        { 'time': `${year}-${month}-${date} 02:00:00`, value: 980 },
        { 'time': `${year}-${month}-${date} 03:00:00`, value: 900 },
        { 'time': `${year}-${month}-${date} 04:00:00`, value: 700 },
        { 'time': `${year}-${month}-${date} 05:00:00`, value: 300 },
        { 'time': `${year}-${month}-${date} 06:00:00`, value: 210 },
        { 'time': `${year}-${month}-${date} 07:00:00`, value: 100 },
        { 'time': `${year}-${month}-${date} 08:00:00`, value: 97 },
        { 'time': `${year}-${month}-${date} 09:00:00`, value: 32 },
        { 'time': `${year}-${month}-${date} 10:00:00`, value: 21 },
        { 'time': `${year}-${month}-${date} 11:00:00`, value: 30 },
        { 'time': `${year}-${month}-${date} 12:00:00`, value: 96 },
        { 'time': `${year}-${month}-${date} 13:00:00`, value: 53 },
        { 'time': `${year}-${month}-${date} 14:00:00`, value: 53 },
        { 'time': `${year}-${month}-${date} 15:00:00`, value: 65 },
        { 'time': `${year}-${month}-${date} 16:00:00`, value: 32 },
        { 'time': `${year}-${month}-${date} 17:00:00`, value: 43 },
        { 'time': `${year}-${month}-${date} 18:00:00`, value: 46 },
        { 'time': `${year}-${month}-${date} 19:00:00`, value: 47 },
        { 'time': `${year}-${month}-${date} 20:00:00`, value: 51 },
        { 'time': `${year}-${month}-${date} 21:00:00`, value: 41 },
        { 'time': `${year}-${month}-${date} 22:00:00`, value: 35 },
        { 'time': `${year}-${month}-${date} 23:00:00`, value: 20 },
        { 'time': `${year}-${month}-${date} 23:59:59`, value: 16 }
    ];

    var seriesesData = new Map([
        ['1일', _1dayData ],
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
        areaSeries = chart.addAreaSeries({
        topColor: 'rgba(237 , 56, 46, 0.5)',
        lineColor: 'rgba(237 , 56, 46, 1)',
        bottomColor: 'rgba(237 , 56, 46, 0)',
        lineWidth: 2,
        });
        areaSeries.setData(seriesesData.get(interval));
    }

    syncToInterval(intervals[0]);
}