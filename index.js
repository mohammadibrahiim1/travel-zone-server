const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// user: user2
// password:0kw4llp4OEF6BZGQ

const cors = require("cors");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://user2:0kw4llp4OEF6BZGQ@cluster0.wuwpwwx.mongodb.net/?retryWrites=true&w=majority";
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  const placesCollection = client.db("travel-agency").collection("places");
  const reviewsCollection = client.db("travel-agency").collection("reviews");
  const tourGuideCollection = client.db("travel-agency").collection("tourGuide");
  const tourguide = require('./Packages/Packages.json');
  try {
    app.get("/places", async (req, res) => {
      const query = {};
      const places = await placesCollection.find(query).toArray();
      // console.log(places);
      res.send(places);
    });

    // add reviews

    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      res.send(result);
    });

    // get reviews
    app.get("/reviews", async (req, res) => {
      const query = {};
      const reviews = await reviewsCollection.find(query).toArray();
      res.send(reviews);
      // console.log(reviews);
    });

    app.get('/tourGuide', async (req,res)=> {
      const query = {};
      const tourGuide = await tourGuideCollection.find(query).toArray()
      res.send(tourGuide);
      console.log(tourGuide);
    });

    app.get('/tourGuide/:id', async (req,res)=> {
      const id = req.params.id;
      const query = {_id: 'new ObjectId(id)'};
      const guideDetails = await tourGuideCollection.findOne(query)
      res.send(guideDetails);
      console.log(guideDetails);
    });



  } finally {
  }
}
run().catch((error) => console.log(error));

// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

app.get("/", (req, res) => {
  res.send("yes working");
});

app.listen(port, () => console.log(`server is running on port ${port}`));
module.exports = app;
