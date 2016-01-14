
var express = require('express');
var app = express();
var bodyParser = require('body-parser');  
var http = require('http');
var httpServer = http.Server(app);
app.use(express.static('./public'));


//--------------
// Server code
//--------------


var server = app.listen(3000, function () {
var host = server.address().address;
var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});


app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: true }));

//--------------
// Api code
//--------------

app.get('/:id', function(req, res){
    res.sendfile('./public/'+req.params.id);
});

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/item/:id', function (req, res) {
	 // res.send('OK! '+req.params.id);
	Item.find({_id: req.params.id},function(error,data){
		  if (error) {
          return res.
            status(500).
            json({ error: error.toString() });
        }
		res.send(data);
	});
});

app.get('/search/:id', function (req, res) {
  Item.find(
      { $text : { $search : req.params.id } }
      ,
      function(error,data){
      if (error) {
          return res.
            status(500).
            json({ error: error.toString() });
        }
    res.send(data);
  });
});

app.post('/newitem', function(req, res) {
    var data={};
    data.name = req.body.name;
    data.description = req.body.description;
    data.description1= req.body.name+" "+req.body.description;
    data.email = req.body.email;
    data.address = req.body.address;
    data.price ={
      amount: parseInt(req.body.price),
      currency: req.body.currency
    };
    data.picture=req.body.img;

    var item = new Item(data);
    item.save(function(error,result){
    console.log(error);
    //console.log(result);  
    });
    //console.log(JSON.stringify(data));
    res.send(item._id);
});


//--------------

// DB code - connection initialization
//--------------


var mongoose = require('mongoose');
mongoose.connect('localhost:27017/example');
var db=mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'));



//--------------
// DB code - Schema
//--------------


Schema =mongoose.Schema;

var ItemSchema= new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    description1: { type: String, required: true },
    email: { type: String,required: true },
    address: { type: String,required: true },

    picture: [{ type: String}],
    price: {
      amount: {
        type: Number,
        required: true
        }
      ,
      // Only 4 supported currencies for now
      currency: {
        type: String,
        required: true
      }}
    });
ItemSchema.index({
  description1: "text"
});

var Item=mongoose.model('baz', ItemSchema);





