var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Url = require('./models/url');
var config = require('./config');

var app = express();

mongoose.connect(process.env.PROD_MONGODB || 'mongodb://' + config.db.host + ':27017/' + config.db.name, function(err){
  if(err){
    throw new Error('Database connection failed');
  } else {
    console.log('Database Connected !');
  }
});

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res){
  res.render('index');
});

app.get('/new', function(req,res){
  res.send({error: 'no url entered'});
});

app.get('/new/:url*', function(req, res){

var longUrl = req.url.slice(5);

if(validateURL(longUrl)){

  var shortUrl = '';
  var json = {};
  var date = Date.now();
  var shortId = Math.floor(1000 + Math.random() * 9000)

  var newUrl = Url({
    _id: shortId,
    longUrl: longUrl,
    created_at: date
  });

  newUrl.save(function(err){
    if(err){
      console.log(err);
    }

    shortUrl = config.webhost + newUrl._id;

    res.send({'longUrl': longUrl,'shortUrl': shortUrl});
  });

} else {

  res.send({'error': 'please enter a valid url'})
}
});

app.get('/:id', function(req, res){
  Url.findOne({_id: req.params.id}, function(err, doc){
    if(doc){
      res.redirect(doc.longUrl);
    } else {
      res.redirect(config.webhost);
    }
  });
});

function validateURL(url) {
    // Checks to see if it is an actual url
    // Regex from https://gist.github.com/dperini/729294
    var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    return regex.test(url);
}

app.listen(app.get('port'), function(){
  console.log('App is running on ', app.get('port'));
  console.log('mongodb://' + config.db.host + ':27017/' + config.db.name);
});
