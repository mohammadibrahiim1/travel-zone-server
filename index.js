const express = require("express");
const DB = require("./connectDB");
const app = express();
const Router = require("./routes/routes");
const ApiRouter = require("./routes/API/apiRoute");
const { ObjectId } = require("mongodb");
const stripe = require("stripe")(
  "sk_test_51MlpzGLrYWLOOZ8Ueo9lSKyjvBkUNZAQCqRDvVO5x1wiwu0MbJ2V6DeVFW7YHcoeCi0axInmbfmxCfIE5MrvaswE003sZXKmdG"
);
const FlightController = require("./controllers/API/FlightController");
// sk_test_51MlpzGLrYWLOOZ8Ueo9lSKyjvBkUNZAQCqRDvVO5x1wiwu0MbJ2V6DeVFW7YHcoeCi0axInmbfmxCfIE5MrvaswE003sZXKmdG
// const ObjectId = require('mongodb').ObjectId;

// user: user2
// password:0kw4llp4OEF6BZGQ

const cors = require("cors");
const { query } = require("express");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//End dataBase Connection
app.use("/", Router);
app.use("/api", ApiRouter);

// const uri =
//   "mongodb+srv://user2:0kw4llp4OEF6BZGQ@cluster0.wuwpwwx.mongodb.net/?retryWrites=true&w=majority";
// console.log(uri);
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverApi: ServerApiVersion.v1,
// });

async function run() {
  const placesCollection = DB.client.db("travel-agency").collection("places");
  const reviewsCollection = DB.client.db("travel-agency").collection("reviews");
  const tourGuideCollection = DB.client
    .db("travel-agency")
    .collection("tourGuide");
  const packagesCollection = DB.client
    .db("travel-agency")
    .collection("packages");
  const paymentCollection = DB.client
    .db("travel-agency")
    .collection("payments");
  const flightsCollection = DB.client.db("travel-agency").collection("flights");
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

    app.get("/tourGuide", async (req, res) => {
      const query = {};
      const tourGuide = await tourGuideCollection.find(query).toArray();
      res.send(tourGuide);
      // console.log(tourGuide);
    });

    // get guide by id

    app.get("/tourGuide/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const guideDetails = await tourGuideCollection.findOne(query);
      res.send(guideDetails);
      // console.log(guideDetails);
    });

    app.get("/packages", async (req, res) => {
      const param = req.query;
      if (!param.intFilter && !param.dmsFilter) {
        const data = await packagesCollection.find({}).toArray();
        return res.send(data);
      } else {
        let filterQueries = [];
        if (param.intFilter) {
          filterQueries = [
            ...filterQueries,
            {
              tourCategory: "International",
            },
          ];
        }
        if (param.dmsFilter) {
          filterQueries = [
            ...filterQueries,
            {
              tourCategory: "Domestic",
            },
          ];
        }
        const filterData = await packagesCollection.find({
          $or:filterQueries
        }).toArray();
        return res.send(filterData);
      }
    });

    app.get("/packages/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const selectedPackage = await packagesCollection.findOne(query);
      res.send(selectedPackage);
      // console.log(selectedPackage);
    });

    // ---------------stripe payment method------------

    // app.post("/createPaymentIntent", async (req, res) => {
    //   const {data} = req.body;
    //   const price = data.price;
    //   const amount = price * 100;

    //   const paymentIntent = await stripe.paymentIntents.create({
    //     currency: "usd",
    //     amount: amount,
    //     payment_method_types: ["card"],
    //   });
    //   res.send({
    //     clientSecret: paymentIntent.client_secret,
    //   });
    // });

    app.post("/create-payment-intent", async (req, res) => {
      const data = req.body;
      const price = data.price;
      const amount = price * 100;

      // Create a PaymentIntent with the order amount and currency

      const paymentIntent = await stripe.paymentIntents.create({
        // amount: calculateOrderAmount(items),
        currency: "usd",
        amount: amount,
        payment_method_types: ["card"],
      });

      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });

    // store payments collection in database
    app.post("/payments", async (req, res) => {
      const payment = req.body;
      const result = await paymentCollection.insertOne(payment);
      // const id = payment.bookingId;
      // const filter = { _id: new ObjectId(id) };
      // const updatedDocument = {
      //   $set: {
      //     paid: true,
      //     transactionId: payment.transactionId,
      //   },
      // };
      // const updatedResult = await bookingsCollection.updateOne(
      //   filter,
      //   updatedDocument
      // );
      // res.send();
      res.send(result);

      // get flight details  by id

      // app.get("/api/flights/:id", async (req, res) => {
      //   const id = req.params.id;
      //   const query = { _id: new ObjectId(id) };
      //   const selectedFlight = await flightsCollection.findOne(query);
      //   res.send(selectedFlight);
      //   // console.log(selectedPackage);
      // });

      // flight controller
      app.get("/flights", FlightController.show);
    });
  } finally {
  }
}
run().catch((error) => console.log(error));

app.get("/", (req, res) => {
  res.send("yes working");
});

app.listen(port, () => console.log(`server is running on port ${port}`));
module.exports = app;
