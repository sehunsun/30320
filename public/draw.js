const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let drawing = false;   // 是否正在畫
let queue = [];        // 暫存上一個座標

// 畫線函式
function drawLine(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}

// 滑鼠按下開始畫
canvas.addEventListener('mousedown', function(e) {
    drawing = true;
    const x = e.pageX - canvas.offsetLeft;
    const y = e.pageY - canvas.offsetTop;
    drawLine(ctx, x, y, x, y);
    queue.push([x, y]);
});

// 滑鼠移動畫線
canvas.addEventListener('mousemove', function(e) {
    if (drawing) {
        const old = queue.shift();
        const x = e.pageX - canvas.offsetLeft;
        const y = e.pageY - canvas.offsetTop;
        drawLine(ctx, old[0], old[1], x, y);
        queue.push([x, y]);
    }
});

// 放開滑鼠結束畫圖
canvas.addEventListener('mouseup', function() {
    drawing = false;
    queue = [];
});

// 顏色與粗細控制
const color = document.getElementById("color");
const lineWidth = document.getElementById("lineWidth");
const value = document.getElementById("value");

value.textContent = lineWidth.value;
ctx.strokeStyle = color.value;
ctx.lineWidth = lineWidth.value;

color.addEventListener("input", (e) => {
    ctx.strokeStyle = e.target.value;
}); 

lineWidth.addEventListener("input", (e) => {
    value.textContent = e.target.value;
    ctx.lineWidth = e.target.value;
});
