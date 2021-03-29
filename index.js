const express = require('express');
const MongoClient = require('mongodb').MongoClient; 
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;

const password = 'sakib1';

const uri = "mongodb+srv://organicUser:sakib1@cluster0.k1ugo.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }); 

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html');
})




client.connect(err => {
  const collection = client.db("organicdb").collection("products");

    //get api
  app.get('/products', (req,res) => {
      collection.find({})
      .toArray((err, documents) => {
          res.send(documents);
      })
  }) 


  //post api
  app.post("/addProduct", (req, res) => {
    const product = req.body;
    collection.insertOne(product)
    .then(result => {
        console.log('Data added successfully');
        res.send('success');
    })
  })//post

  //load products
  app.get('/product/:id', (req, res) => {
    collection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents) => {
      res.send(documents[0]);
    })
  })

  //update api
  app.patch('/update/:id', (req, res) => {
    collection.updateOne({_id: ObjectId(req.params.id)}, 
    {
      $set: {
        price:req.body.price,
        quantity:req.body.quantity
      }
    })
    .then(result => {
      console.log(result)
    })
  })

//delete api
  app.delete('/delete/:id', (req, res) => {
      collection.deleteOne({_id: ObjectId(req.params.id)})
      .then((result)=>{
          console.log(result)
      })
  })

  
  console.log('database Connection done')
});



app.listen(4200);