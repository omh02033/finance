let search_bar = document.getElementById("finance_search");
let searchb = document.querySelector(".mainsearchb");
let search_b = document.querySelector(".searchb");
let top_explain = document.querySelector(".explain");
let xb = document.querySelector(".xb");
let search_cancel = document.getElementById("search_cancel");
let s_top = document.querySelector(".top");
let main_blind = document.querySelector(".main_blind");

let bottoming = false;

let key_db = {};

search_bar.addEventListener("keyup", form_search);

function form_search(e) {
    if(!search_bar.value) {
        while(main_blind.hasChildNodes()) {
            main_blind.removeChild(main_blind.firstChild);
        }
        xb.classList.remove("dn");
        xb.classList.remove("df");
        xb.classList.add("dn");
        main_blind.classList.remove("searched");
        main_blind.classList.remove("search_mode");
        main_blind.classList.add("search_mode");
    } else {
        xb.classList.remove("df");
        xb.classList.remove("dn");
        xb.classList.add("df");
        main_blind.classList.remove("search_mode");
        main_blind.classList.remove("searched");
        main_blind.classList.add("searched");
    }

    let keycode = [8, 9, 16, 17, 18, 19, 20, 21 ,25, 27, 32, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 91, 92, 93, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 144, 145];
    if(keycode.indexOf(e.keyCode) !== -1) return;
    if(e.keyCode == 13) search_bar.blur();
    if(search_bar.value && !key_db[search_bar.value]) {
        let loader = document.createElement("div");
        loader.classList.add("loader");
        main_blind.appendChild(loader);
        let info = { val: search_bar.value }
        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/search/');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4 && xhr.status === 200) {
                while(main_blind.hasChildNodes()) {
                    main_blind.removeChild(main_blind.firstChild);
                }
                if(search_bar.value == '디미파이') {
                    while(main_blind.hasChildNodes()) {
                        main_blind.removeChild(main_blind.firstChild);
                    }
                    let div = document.createElement("div");
                    div.classList.add(`f_dimigo`);
                    div.ontouchend = function() {
                        if(!bottoming) {
                            bottoming = true;
                            dimigo_bottom_on(this);
                        }
                    }
        
                    let main_name = document.createElement("div");
                    let long_name = document.createElement("div");
        
                    main_name.classList.add("main_name");
                    long_name.classList.add("long_name");
        
                    main_name.innerHTML = 'DIMI-FI';
                    long_name.innerHTML = '디미파이';
        
                    div.appendChild(main_name);
                    div.appendChild(long_name);
        
                    main_blind.appendChild(div);
                }
                let data = JSON.parse(xhr.responseText);
                let d = data.data.substring(27, data.data.length-1);
                d = JSON.parse(d);
                key_db[search_bar.value] = d;

                for(let i=0; i < d.items[0].length; i++) {
                    let div = document.createElement("div");
                    div.classList.add(`f_${d.items[0][i][0]}`);

                    div.ontouchend = function() {
                        if(!bottoming) {
                            bottoming = true;
                            search_bottom_on(this);
                        }
                    }

                    let main_name = document.createElement("div");
                    let long_name = document.createElement("div");

                    main_name.classList.add("main_name");
                    long_name.classList.add("long_name");

                    main_name.innerHTML = d.items[0][i][1];
                    long_name.innerHTML = d.items[0][i][0];

                    div.appendChild(main_name);
                    div.appendChild(long_name);

                    main_blind.appendChild(div);
                }
            }
        }
        xhr.send(JSON.stringify(info));
    } else if(search_bar.value && key_db[search_bar.value]) {
        while(main_blind.hasChildNodes()) {
            main_blind.removeChild(main_blind.firstChild);
        }
        for(let i=0; i < key_db[search_bar.value].items[0].length; i++) {
            let div = document.createElement("div");
            div.classList.add(`f_${key_db[search_bar.value].items[0][i][0]}`);

            div.ontouchend = function() {
                if(!bottoming) {
                    bottoming = true;
                    search_bottom_on(this);
                }
            }

            let main_name = document.createElement("div");
            let long_name = document.createElement("div");

            main_name.classList.add("main_name");
            long_name.classList.add("long_name");

            main_name.innerHTML = key_db[search_bar.value].items[0][i][1];
            long_name.innerHTML = key_db[search_bar.value].items[0][i][0];

            div.appendChild(main_name);
            div.appendChild(long_name);

            main_blind.appendChild(div);
        }
    }
}


function search_focus() {
    top_explain.classList.remove("exdn");
    top_explain.classList.remove("exdb");
    top_explain.classList.add("exdn");
    searchb.classList.remove("sbtop1")
    searchb.classList.remove("sbtop55");
    searchb.classList.add("sbtop1");
    search_cancel.classList.remove("s_ctrans35to0");
    search_cancel.classList.remove("s_ctrans0to35");
    search_cancel.classList.add("s_ctrans35to0");
    s_top.classList.remove("toph65");
    s_top.classList.remove("toph110");
    s_top.classList.add("toph65");
    main_blind.classList.remove("searched");
    main_blind.classList.remove("search_mode");
    main_blind.classList.add("search_mode");
    let main = document.querySelector(".main");
    main.classList.remove("main_search_focus");
    main.classList.remove("main_search_blur");
    main.classList.add("main_search_focus");
}
function search_blur() {
    while(main_blind.hasChildNodes()) {
        main_blind.removeChild(main_blind.firstChild);
    }
    search_bar.value = "";
    top_explain.classList.remove("exdb");
    top_explain.classList.remove("exdn");
    top_explain.classList.add("exdb");
    searchb.classList.remove("sbtop55");
    searchb.classList.remove("sbtop1");
    searchb.classList.add("sbtop55");
    search_cancel.classList.remove("s_ctrans0to35");
    search_cancel.classList.remove("s_ctrans35to0");
    search_cancel.classList.add("s_ctrans0to35");
    xb.classList.remove("dn");
    xb.classList.remove("df");
    xb.classList.add("dn");
    main_blind.classList.remove("search_mode");
    main_blind.classList.remove("searched");
    s_top.classList.remove("toph110");
    s_top.classList.remove("toph65");
    s_top.classList.add("toph110");
    let main = document.querySelector(".main");
    main.classList.remove("main_search_blur");
    main.classList.remove("main_search_focus");
    main.classList.add("main_search_blur");
}

search_bar.onfocus = () => {
    bottoming = false;
    if(!search_bar.value) {
        search_focus();
    }
}
search_bar.onblur = () => {
    if(!search_bar.value) {
        search_blur();
    }
}

search_cancel.onclick = () => {
    search_blur();
}

xb.onclick = () => {
    while(main_blind.hasChildNodes()) {
        main_blind.removeChild(main_blind.firstChild);
    }
    search_bar.value = "";
    xb.classList.remove("dn");
    xb.classList.remove("df");
    xb.classList.add("dn");
    search_bar.focus();
}