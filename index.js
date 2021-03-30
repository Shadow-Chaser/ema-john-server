const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
app.use(bodyParser.json())
app.use(cors())
require('dotenv').config()
const port = 8000



const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m8cui.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db(`${process.env.DB_NAME}`).collection("products");
    console.log("connected");
    app.post('/addProduct', (req, res)=>{
      // const product = req.body;
      // productCollection.insertOne(product)
      // .then(result=>{
      //   console.log(result);
      // })

      const products = req.body;
      productCollection.insertMany(products)
      .then(result=>{
        // console.log(result);
        console.log(result.insertedCount);
        res.send(result.insertedCount)
      })

    })

    app.get('/products', (req, res)=>{
      productCollection.find({})
      .toArray((err, documents)=>{
        res.send(documents);
      })
    })

    app.get('/product/:key', (req, res)=>{
      productCollection.find({key: req.params.key})
      .toArray((err, document)=>{
        res.send(document[0]);
      })
    })

    app.post('/productsByKeys',(req, res)=>{
      const productKeys = req.body;
      productCollection.find({key: { $in: productKeys}})
      .toArray((err, documents)=>{
        res.send(documents);
      })
    })

});




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})