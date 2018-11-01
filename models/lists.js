var mongoose = require('mongoose');
const listSchema = new mongoose.Schema(
  {
    title: String,
    time:{
      type:Date,
      default: Date.now
    }
  })

const List = mongoose.model('List', listSchema);
module.exports = {List};