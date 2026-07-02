"use strict"
//変数の宣言はlet
//const ラムダ式でボタンが押されたかなどを書く
//const url = '/';
//fetch(url, params)でurlにデータを送る
//スタートボタンを押す
//カードを引くボタンを押すとカードが追加されるようにする
//stayボタンを追加

let cards = [];
//cpuCard配列を作るべき = [{"suit":"NNN","value":N}]
let playerCard = [];
let cpuCard = [];
let next_card = 4;

//柄と数字の合うカードを表示させる
function addCardToArea(areaId, card) {
    const img = document.createElement("img");
    img.src = `/public/images/${card.suit}-${card.value}.png`; // 画像パスを組み立て
    img.className = "card-img";
    document.getElementById(areaId).appendChild(img);
}
//裏返しのカードを表示させる
function addBackCard(areaId) {
    const img = document.createElement("img");
    img.src = `/public/images/back.png`; // 裏面画像
    img.className = "card-img";
    img.id = "cpu_back";
    document.getElementById(areaId).appendChild(img);
}
//カードの足し算
function count(array){
    let ace_count = 0;
    let total = 0;
    for(let i =0; i < array.length; i++){
        if(array[i].value > 10 ) total += 10; //ルールにより10以上は10として扱う
        else if(array[i].value == 1){ //1だったら取り合えず1として
            ace_count += 1;
            total+= 1;
        }
        else total += array[i].value; //ふつうのはそのまま
    }
    //なるべく21近付ける
    while(ace_count > 0 && total+10 <= 21){ //1を11にした時の処理
        total += 10;
        ace_count --;
    }
    console.log(total);
    return total;
}
//startボタンが押されたら
document.querySelector('#start').addEventListener('click', () =>{
    // ボタンを非表示にする
    document.querySelector('#start').style.display = "none";
    //ボタンを表示にする
    document.querySelector('#hit').style.display= "inline";
    document.querySelector('#stay').style.display= "inline";
    //ディーラーとプレイヤーを表示する
    document.querySelector('.dealer_area').style.display="block";
    document.querySelector('.player_area').style.display="block";
    console.log("start");
    const params = {
        method: "POST",
        body: '',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    const url = '/start';//startに山札を要求する
    fetch(url, params)
    .then((response) => {
        if(!response.ok){
            throw new Error('Error at start');
        }
        return response.json()
    })
    .then((response) => {
        cards = response.cards; //カードを読み取る
        console.log(cards);
        //読み取った配列の0,1をplayerのカードとし,,2,3をcpuのカードとする
        //playerCard配列に順に入れる
        playerCard.push(cards[0]);
        playerCard.push(cards[1]);
        cpuCard.push(cards[2]);
        cpuCard.push(cards[3]);

        //トータルの値を表示する
        document.getElementById('dealer_score').textContent = `ディーラーの合計: ${cpuCard[0].value}~${cpuCard[0].value+11}`;
        let playertotal = count(playerCard);
        document.getElementById('player_score').textContent = `プレイヤーの合計: ${playertotal}`;

        //ここでimgをさーばからもらう
        // 画像を表示（プレイヤー）
        console.log(playerCard);
        addCardToArea("player_cards", playerCard[0]);
        addCardToArea("player_cards", playerCard[1]);

        // CPUは1枚伏せて1枚だけ表示
        console.log(cpuCard);
        addCardToArea("dealer_cards", cpuCard[0]);
        addBackCard("dealer_cards"); // ← 裏面カード

        //playerの手札とcpuの手札の値を読み取るここで/judgeにいく？
        console.log("player_value:"+ cards[0].value + cards[1].value);
        console.log("cpu_value:"+cards[2].value + cards[3].value);

    });
});

//stayボタンが押された時(cpuの手札を増やす時)
document.querySelector('#stay').addEventListener('click', () => { 
    //cpuの手札をオープン
    const backCardImg = document.getElementById("cpu_back");
    if (backCardImg) {
        // CPUの2枚目のカードの表画像に変更
        backCardImg.src = `/public/images/${cpuCard[1].suit}-${cpuCard[1].value}.png`;
    }
    //cpuのカードの値を計算 count(cpuCard)
    //cpu<17なら山札からカードを追加
    while(count(cpuCard) < 17){
        cpuCard.push(cards[next_card]);
        addCardToArea("dealer_cards", cards[next_card]);
        console.log('pushTotal:'+count(cpuCard));
        next_card ++;//<-山札の次の値
    }
    
    //cpu>17になったら"/judge"へ勝敗を聞きに行く
    const cpu = count(cpuCard);
    const you = count(playerCard);
    //トータルの値を表示する
    document.getElementById('dealer_score').textContent = `ディーラーの合計: ${cpu}`;
    document.getElementById('player_score').textContent = `プレイヤーの合計: ${you}`;

    console.log("you:"+you+"cpu:"+cpu);
    const params = {
        method: "POST",
        body: 'cpu='+ cpu+'&you='+you,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    const url = '/judge';//judgeへ
    fetch(url, params)
    .then((response) => {
        if(!response.ok){
            throw new Error('Error at start');
        }
        return response.json()
    })
    .then((response) => {
        const result = response.result;
        console.log(result);
        //hitとstay非表示
        document.querySelector('#hit').style.display = "none";
        document.querySelector('#stay').style.display = "none";
        //ボタンを表示にする
        document.querySelector('#reset').style.display= "inline";
        //勝敗に応じて反応
        setTimeout(() => {
            if(result == 'win') alert("あなたの勝ち!"); 
            else if(result == 'lose') alert("あなたの負け...");  
        }, 300);
    });
});

//hitボタンが押された時(playerの手札を増やす時)
document.querySelector('#hit').addEventListener('click', ()=> {
    //山札の次カードを取り表示させる　<-stayの処理と同じ
    playerCard.push(cards[next_card]);
    addCardToArea("player_cards", cards[next_card]);
    next_card ++;//<-山札の次の値
    //トータルの値を表示する
    document.getElementById('dealer_score').textContent = `ディーラーの合計: ${cpuCard[0].value}~${cpuCard[0].value+11}`;
    document.getElementById('player_score').textContent = `プレイヤーの合計: ${count(playerCard)}`;
    //手札>21になったら"/judge"へ行く(burst)
    if(count(playerCard ) > 21){
        const cpu = count(cpuCard);
    const you = count(playerCard);
    console.log("you:"+you+"cpu:"+cpu);
    const params = {
        method: "POST",
        body: 'cpu='+ cpu+'&you='+you,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    const url = '/judge';//judgeへ
    fetch(url, params)
    .then((response) => {
        if(!response.ok){
            throw new Error('Error at start');
        }
        return response.json()
    })
    .then((response) => {
        const result = response.result;
        console.log(result);
        //hitとstay非表示
        //hitとstay非表示
        document.querySelector('#hit').style.display = "none";
        document.querySelector('#stay').style.display = "none";
        //ボタンを表示にする
        document.querySelector('#reset').style.display= "inline";
        //勝敗に応じて反応
        setTimeout(() => {
            if(result == 'win') {
                alert("あなたの勝ち!");
            }
            else if(result == 'lose') {
                alert("あなたの負け...");
            }
        }, 300);
    });
    }
});

document.querySelector('#reset').addEventListener('click', () => {
    location.reload();
});