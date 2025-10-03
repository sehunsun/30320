const guessSubmit = document.querySelector(".guessSubmit");
const guessField = document.querySelector(".guessField");
const result = document.querySelector(".result");
const count = document.querySelector(".count");

 let countNum =0;   //廣域變數
function checkGuess() {
    countNum++;
    count.textContent = "猜測次數："+countNum;
    //guessField.focus();       //游標焦點預設在輸入欄位裡
}
guessSubmit.addEventListener("click", checkGuess);   //當按鈕被點擊，執行函式

let randomNumber = Math.random();
console.log("觀察隨機的數字：", randomNumber);

const userGuess = Number(guessField.value);  //取得欄位值，並轉為數字
if  (  x === y) {
    result.textContent = "猜測結果：Congratulations!" ;
}
else if (x  < y ) {
    result.textContent = "猜測結果：數字太小!" ;
}
else if (x  >  y ) {
    result.textContent = "猜測結果：數字太大!";
}

result.textContent += "遊戲結束";
result.style.backgroundColor="red";
alert("遊戲結束");
setGameOver();

function setGameOver() {
        guessField.disabled = true; //停止輸入功能
        guessSubmit.disabled = true;    //停止按鈕功能
}
