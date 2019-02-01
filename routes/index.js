var express = require('express');
var router = express.Router();
var app = express();

//******** MongoDB connection */
const MongoClient = require('mongodb').MongoClient,
ObjectID = require('mongodb').ObjectID;
// Create a new ObjectID
var db;
MongoClient.connect('mongodb://localhost:27017/crudapi',{ useNewUrlParser: true }, (err, client) => {
  if (err) return console.log(err)
  db = client.db('crudapi') // your database name 
  app.listen(27017, () => {
    console.log('MongoDB listening on 27017')
  })
})

/* GET home page. */
router.get('/', function(req, res, next) {
  var JsonData = 'JUST </CODE> ^_^';
  try {
    res.json({data:JsonData});
  } catch (e) {
    res.status(400).send('Invalid JSON string');
  }
});

/* GET all quotes */
router.get('/quotes', (req, res) => {
  var cursor = db.collection('quotes').find().toArray(function(err, results) {
    res.json(results);
  })
})

/* GET  quotes by ID */

router.get('/quotes/:id', (req, res, next) => {
  let id = ObjectID(req.params.id);
  var cursor = db.collection('quotes').find(id).toArray( (err, result) => {
    if(err) {
      throw err;
    }
    res.json(result);
  });
});

/* POST add quotes */
router.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/quotes')
  })
})

/* PUT update quotes */
router.put('/quotes/:id', (req, res, next) => {
  let id = ObjectID(req.params.id);
  db.collection("quotes").updateOne({_id: id}, {$set:{'name': req.body.name, 'description': req.body.description}}, (err, result) => {
    if(err) {
      throw err;
    }
    res.redirect('/quotes')
  });
});


/*  DELETE Deleting quotes by ID */

router.delete('/quotes/:id', (req, res, next) => {
  let id = ObjectID(req.params.id);
  db.collection('quotes').deleteOne({_id: id}, (err, result) => {
    if(err) {
      throw err;
    }
    res.redirect('/quotes')
  });
});

module.exports = router;
