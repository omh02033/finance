let search_bar = document.getElementById("finance_search");
let searchb = document.querySelector(".mainsearchb");
let search_b = document.querySelector(".searchb");
let top_explain = document.querySelector(".explain");
let xb = document.querySelector(".xb");
let search_cancel = document.getElementById("search_cancel");
let s_top = document.querySelector(".top");
let main_blind = document.querySelector(".main_blind");


function form_search(e) {
    e.preventDefault();
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
    search_focus();
}
search_bar.onblur = () => {
    if(!search_bar.value) {
        search_blur();
    }
}
search_bar.onkeyup = () => {
    if(!search_bar.value) {
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
}

search_cancel.onclick = () => {
    search_blur();
}

xb.onclick = () => {
    search_bar.value = "";
    xb.classList.remove("dn");
    xb.classList.remove("df");
    xb.classList.add("dn");
    search_bar.focus();
}