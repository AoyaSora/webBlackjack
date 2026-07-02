const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
//トランプ情報
let cards =[
      {"suit": "club", "value": 1}, {"suit": "club", "value": 2}, {"suit": "club", "value": 3}, {"suit": "club", "value": 4},
      {"suit": "club", "value": 5}, {"suit": "club", "value": 6}, {"suit": "club", "value": 7}, {"suit": "club", "value": 8},
      {"suit": "club", "value": 9}, {"suit": "club", "value": 10}, {"suit": "club", "value": 11}, {"suit": "club", "value": 12}, {"suit": "club", "value": 13},
  
      {"suit": "diamond", "value": 1}, {"suit": "diamond", "value": 2}, {"suit": "diamond", "value": 3}, {"suit": "diamond", "value": 4},
      {"suit": "diamond", "value": 5}, {"suit": "diamond", "value": 6}, {"suit": "diamond", "value": 7}, {"suit": "diamond", "value": 8},
      {"suit": "diamond", "value": 9}, {"suit": "diamond", "value": 10}, {"suit": "diamond", "value": 11}, {"suit": "diamond", "value": 12}, {"suit": "diamond", "value": 13},
  
      {"suit": "heart", "value": 1}, {"suit": "heart", "value": 2}, {"suit": "heart", "value": 3}, {"suit": "heart", "value": 4},
      {"suit": "heart", "value": 5}, {"suit": "heart", "value": 6}, {"suit": "heart", "value": 7}, {"suit": "heart", "value": 8},
      {"suit": "heart", "value": 9}, {"suit": "heart", "value": 10}, {"suit": "heart", "value": 11}, {"suit": "heart", "value": 12}, {"suit": "heart", "value": 13},
  
      {"suit": "spade", "value": 1}, {"suit": "spade", "value": 2}, {"suit": "spade", "value": 3}, {"suit": "spade", "value": 4},
      {"suit": "spade", "value": 5}, {"suit": "spade", "value": 6}, {"suit": "spade", "value": 7}, {"suit": "spade", "value": 8},
      {"suit": "spade", "value": 9}, {"suit": "spade", "value": 10}, {"suit": "spade", "value": 11}, {"suit": "spade", "value": 12}, {"suit": "spade", "value": 13}
]; //cards[n].suit
//cards[n].value


const shuffleArray = (array) => {
    const cloneArray = [...array]

    for (let i = cloneArray.length - 1; i >= 0; i--) {
      let rand = Math.floor(Math.random() * (i + 1))
      // 配列の要素の順番を入れ替える
      let tmpStorage = cloneArray[i]
      cloneArray[i] = cloneArray[rand]
      cloneArray[rand] = tmpStorage
    }

    return cloneArray
}

//開始
app.post("/start", (req, res) => {
    //山札としてここはランダムな配列にしたい c:1~13 d:1~13 h:1~13 s:1~13
    //console.log('start');
    const stock = shuffleArray(cards);
    //resとしてシャッフルされたカードを送る
    //console.log(stock);
    res.json({cards: stock});
});

//勝ち負けを判別
app.post("/judge", (req, res) => {
    const cpu = req.body.cpu;
    const you = req.body.you;
    console.log("you:"+you+"cpu:"+cpu);
    let result = '';
    if(you > 21) result = 'lose'; //手札が21以上で負け
        else if(cpu > 21) result = 'win'; //cpu手札が21以上で負け
            else if(cpu > you) result ='lose'; //cpuのほうが21に近かったら負け
            else result = 'win';//同数か21に近かったら勝ち
    res.json({result: result});
});

// app.post("/next_game", (req, res) => {

// });

app.listen(3000, () => console.log("Example app listening on port 3000!"));