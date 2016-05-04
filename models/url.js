var mongoose = require('mongoose');

var urlSchema = mongoose.Schema({
  _id: Number,
  longUrl: String,
  shortId: Number,
  created_at: Date
});

var Url = mongoose.model('Url', urlSchema);
module.exports = Url;
