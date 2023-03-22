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
  const bookingsCollection = DB.client
    .db("travel-agency")
    .collection("bookings");

  const tourGuideCollection = DB.client
    .db("travel-agency")
    .collection("tourGuide");
  const packagesCollection = DB.client
    .db("travel-agency")
    .collection("packages");
  const paymentCollection = DB.client
    .db("travel-agency")
    .collection("payments");
  // const flightsCollection = DB.client.db("travel-agency").collection("flights");
  // const hotelsCollection = DB.client.db()
  try {
    const hotelPlaceCollection = DB.client
      .db("travel-agency")
      .collection("hotel-Country");
    // console.log(hotelPlaceCollection);
    const categoryCollection = DB.client
      .db("travel-agency")
      .collection("category");
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
      if (
        !param.intFilter &&
        !param.dmsFilter &&
        !param.tpFilter &&
        !param.twpFilter &&
        !param.thrFilter
      ) {
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
        if (param.tpFilter) {
          filterQueries = [
            ...filterQueries,
            {
              offer: "10% discount",
            },
          ];
        }
        if (param.twpFilter) {
          filterQueries = [
            ...filterQueries,
            {
              offer: "20% discount",
            },
          ];
        }
        if (param.thrFilter) {
          filterQueries = [
            ...filterQueries,
            {
              offer: "30% discount",
            },
          ];
        }
        const filterData = await packagesCollection
          .find({
            $or: filterQueries,
          })
          .toArray();
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
      const price = data.totalPrice;
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

      // ================
    });

    // ---------------hotel-bookings-------------

    app.get("/hotelPlaces", async (req, res) => {
      const query = {};
      const result = await hotelPlaceCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/category", async (req, res) => {
      if (req.query.country) {
        const query = { country: req.query.country };
        const result = await categoryCollection.find(query).toArray();
        res.send(result);
      } else {
        const query = {};
        const result = await categoryCollection.find(query).toArray();
        res.send(result);
        console.log(result);
      }
    });

    // ===============================

    app.get("/category/filter/v2", async (req, res) => {
      const param = req.query;
      if (
        !param.brfFilter &&
        !param.frIntFilter &&
        !param.freeAirFilter &&
        !param.airConFilter &&
        !param.fitness &&
        !param.pool
      ) {
        const data = await categoryCollection.find({}).toArray();
        return res.send(data);
      } else {
        let filterQueries = [];
        if (param.brfFilter) {
          filterQueries = [
            ...filterQueries,
            {
              freeBreakFast: "Free breakfast",
            },
          ];
        }

        if (param.frIntFilter) {
          filterQueries = [
            ...filterQueries,
            {
              freeInternet: "Free internet",
            },
          ];
        }
        if (param.freeAirFilter) {
          filterQueries = [
            ...filterQueries,
            {
              freeAirportShuttle: "Free airport shuttle",
            },
          ];
        }

        if (param.airConFilter) {
          filterQueries = [
            ...filterQueries,
            {
              airConditioned: "Air conditioned",
            },
          ];
        }

        if (param.fitness) {
          filterQueries = [
            ...filterQueries,
            {
              fitness: "Fitness",
            },
          ];
        }

        if (param.pool) {
          filterQueries = [
            ...filterQueries,
            {
              pool: "Pool",
            },
          ];
        }

        const filterData = await categoryCollection
          .find({ $or: filterQueries })
          .toArray();
        return res.send(filterData);
      }
    });

    // ==========================================find hotel=============================

    app.get("/category/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const booking = await categoryCollection.findOne(query);
      res.send(booking);
    });

    app.get("/category/search/getHotelBySearch", async (req, res) => {
      try {
        const city = req.query.city;
        const price = parseInt(req.query.price);
        const room = parseInt(req.query.room);
        const guests = parseInt(req.query.guests);

        const hotels = await categoryCollection
          .find({
            $and: [
              city ? { city } : {},
              price ? { price: { $lte: price } } : {},
              room ? { room: { $gte: room } } : {},
              guests ? { guests: { $gte: guests } } : {},
            ],
          })
          .toArray();

        res.status(200).json({
          success: true,
          message: "Successful",
          data: hotels,
        });
      } catch (err) {
        res.status(404).json({
          success: false,
          message: "not found",
        });
      }
    });

    // ================= booking data =================

    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      console.log(booking);
      const result = await bookingsCollection.insertOne(booking);
      res.send(result);
    });

    app.get("/bookings", async (req, res) => {
      const query = {};
      const result = await bookingsCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const bookedPackage = await bookingsCollection.findOne(query);
      res.send(bookedPackage);
      console.log(bookedPackage);
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
