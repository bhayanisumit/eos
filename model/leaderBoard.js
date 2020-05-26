const mongoose = require('mongoose');
const { Schema } = mongoose;

const leaderBoard = mongoose.Schema({
    gameName : String,
    user : String,
    score : Number,
    date : { type: Date, default: Date.now },
});

module.exports = mongoose.model('leaderBoard', leaderBoard);