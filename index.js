const express = require('express');

const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
let  CORS = require('cors'); 
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(bodyParser.json({ limit: '50mb' }));
 
// Models
const board = require('./model/leaderBoard'); 

app.use(CORS());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
        // Note: __dirname is directory that contains the JavaScript source code. Try logging it and see what you get!
        // Mine was '/Users/zellwk/Projects/demo-repos/crud-express-mongo' for this app.
})

app.post('/scores',(req,res) =>{
  var retval = {};
  var mp = "";

  mp += !req.body.gameName ? mp.length ? "|gameName" : "Game name" : "";
  mp += !req.body.userName ? mp.length ? "|UserName" : "user name" : "";
  mp += !req.body.score ? mp.length ? "|Score" : "score" : "";
  if (mp.length) {
     retval.status = 0;
    retval.message = "Missing parameters: " + mp;
    return res.status(200).send(retval);
  }
  var insertBoardData = new board();
    insertBoardData.gameName = req.body.gameName;
    insertBoardData.user = req.body.userName;
    insertBoardData.score = req.body.score;
    insertBoardData.save((err,result) =>{
        if(err) return res.status(200).send({'status' : false , 'msg' : 'error in save game board'});
        return (result)?res.status(200).send({'status' : true , 'msg' : 'Save successfully'}):res.status(200).send({'status' : false , 'msg' : 'Game data not saved'});
    })
})
 
app.get('/scores/:gamename',(req,res) =>{
    board.find({gameName : req.params.gamename }).sort({score : -1}).limit(10).exec((err,result) => {
        if(err) return res.status(200).send({'status' : false , 'msg' : 'error in fetch board data'});
        return (result.length)?res.status(200).send({'status' : true , data:result, 'msg' : 'Board Data'}):res.status(200).send({'status' : false , 'msg' : 'Not found Board Data'});
      })
})
 
app.get('/gamename',(req,res) =>{
  board.distinct('gameName', (err, result) => {
    if(err) return res.status(200).send({'status' : false , 'msg' : 'error in gamename'});
    return (result.length)?res.status(200).send({'status' : true , data:result, 'msg' : 'gamename Data'}):res.status(200).send({'status' : false , 'msg' : 'No gamename found'});
  });
})
 
 
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
 
mongoose.connect('mongodb+srv://eos:Eos12345@cluster0-tn6bv.mongodb.net/eosdubline', function (err, res) {
  if (err) {
  console.log ('ERROR connecting to.' + err);
  } else {
     
    console.log ('Succeeded connected to MongoDb:');
    app.listen(4000, () => {
      console.log('listening on 4000')
    })
  }
});