window.addEventListener('orientationchange', function () {
    if (window.orientation == -90) {
        alert("가로모드로 진행하면\n페이지가 제대로 보이지 않습니다.\n(세로모드 권장)");
        document.body.className = 'orientright';
    }
    if (window.orientation == 90) {
        alert("가로모드로 진행하면\n페이지가 제대로 보이지 않습니다.\n(세로모드 권장)");
        document.body.className = 'orientleft';
    }
    if (window.orientation == 0) {
        document.body.className = '';
    }
}, true);