const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require ('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://carsToytopia:zNDDw8sszNxNOkfT@cluster2.p1tk2ky.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    const toyCollection = client.db('toyDB').collection('toy');


     // send all data to database
     app.post('/toy', async(req, res)=> {
      const newToy = req.body;
      console.log(newToy);
      const result = await toyCollection.insertOne(newToy);
      res.send(result);
  });


  // update a toy
  app.put('/singleToy/:id', async(req, res) =>{
          const id = req.params.id;
          const filter = { _id: new ObjectId (id) };
          const options = {upsert: true};
          const updatedToy = req.body;
          console.log(updatedToy);
          const toy = {
            $set:{
              name: updatedToy.name,
              sellerName: updatedToy.sellerName,
              sellerEmail: updatedToy.sellerEmail,
              subCategory: updatedToy.subCategory,
              subCategoryId: updatedToy.subCategoryId,
              photo: updatedToy.photo,
              rating: updatedToy.rating,
              price: updatedToy.price,
              quantity: updatedToy.quantity,
              description:updatedToy.description
            }
          }

          const result  = await toyCollection.updateOne(filter,toy,options);
          res.send(result);
  })


  // data delete
  app.post('/dSingleToy/:id', async(req, res) => {
    const id  = req.params.id;
    console.log(id);
    const query = {_id: new ObjectId(id)}
    const result = await toyCollection.deleteOne(query);
    res.send(result); 
  })


// receive all data from database
    app.get('/toy', async(req,res) =>{
        const query = {}
        const result = await toyCollection.find(query).toArray();
        res.send(result);
    })

    // find specific data from mongoDB
    app.get('/myToy', async(req, res)=> {
      const sellerEmail = req.query.sellerEmail;
      const query = {sellerEmail:sellerEmail};
      const result = await toyCollection.find(query).toArray();
      res.send(result);
    })

    // update a specific toy data
     app.get('/singleToy/:id', async(req, res)=> {
      const id = req.params.id;
      const query = { _id: new ObjectId (id)}
      const result = await toyCollection.findOne(query);
      res.send(result);
     })

     app.get('/allCategory/:text', async (req, res) => {
      console.log(req.params.text);
      if (req.params.text == "RegularCar" || req.params.text == "PoliceCar" || req.params.text == "TruckCar"){
        const result = await toyCollection.find({subCategory: req.params.text}).toArray();
        return res.send(result);
      }
      // const result = await toyCollection.find({}).toArray();
      // res.send(result);
     });
    


   





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res)=>{
    res.send('cars toytopia is running')
})

app.listen(port,()=>{
    console.log(`cars toytopia server is running on port: ${port}`);
});


