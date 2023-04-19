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
  // here is the  collections of data in database. here "travel-agency is the client  name and "collection("") is the name of data.example: "travel-agency" = db-name and "places" = dataName.
  const placesCollection = DB.client.db("travel-agency").collection("places");
  const reviewsCollection = DB.client.db("travel-agency").collection("reviews");
  const favouritesHotelCollection = DB.client
    .db("travel-agency")
    .collection("favouritesHotel");
  const favouritesFlightsCollection = DB.client
    .db("travel-agency")
    .collection("favouritesFlights");
  const favouritesCollection = DB.client
    .db("travel-agency")
    .collection("favourites");
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
  const usersCollection = DB.client.db("travel-agency").collection("users");
  const rentCarServicesCollection = DB.client
    .db("travel-agency")
    .collection("rent-car-services");
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
    // when user add a reviews this code save user reviews and user data in database.

    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      res.send(result);
    });

    // get reviews
    // by this code you can get the user reviews and user info from database.

    app.get("/reviews", async (req, res) => {
      const query = {};
      const reviews = await reviewsCollection.find(query).toArray();
      res.send(reviews);
      // console.log(reviews);
    });

    // you can get the tour guide data from database by this code

    app.get("/tourGuide", async (req, res) => {
      const query = {};
      const tourGuide = await tourGuideCollection.find(query).toArray();
      res.send(tourGuide);
      // console.log(tourGuide);
    });

    // get guide by id and user see the guide details which guide details he wants to see

    app.get("/tourGuide/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const guideDetails = await tourGuideCollection.findOne(query);
      res.send(guideDetails);
      // console.log(guideDetails);
    });

    //  get offer packages data and filter data by checkbox filter.

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

    // get packages data by id from database and see details when you click a specifiq package.

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

    //  here the code is for payment method. use stripe payment so user can pay for his booking packages , flights and hotels.

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

    // when user click on pay button then  store payments information in  collection in database
    app.post("/payments", async (req, res) => {
      const payment = req.body;
      const result = await paymentCollection.insertOne(payment);
      const id = payment.bookingId;
      const filter = { _id: new ObjectId(id) };
      const updatedDocument = {
        $set: {
          paid: true,
          transactionId: payment.transactionId,
        },
      };
      const updatedResult = await bookingsCollection.updateOne(
        filter,
        updatedDocument
      );
      // res.send();
      res.send(result);

      // ================
    });

    // ---------------hotel-bookings-------------

    //  get all the hotels data from database and display.

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

    //  get hotel data from database and filter hotels list by hotel category in  checkbox filter

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
    //  get a specific hotels details by a specific id
    app.get("/category/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const booking = await categoryCollection.findOne(query);
      res.send(booking);
    });

    //  find a hotel search by city name , price , room and num of guests.

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

    //  user click on book now button and store data in database in booking collection.

    app.post("/bookings", async (req, res) => {
      const booking = req.body;

      const result = await bookingsCollection.insertOne(booking);
      res.send(result);
    });

    //  when user click on heart icon in  packages  will be set on favourite data and store data in database named favourites.
    app.post("/favourites", async (req, res) => {
      const favourites = req.body;
      const result = await favouritesCollection.insertOne(favourites);
      res.send(result);
    });

    //  when user click on heart icon in  hotels  will be set on favourite data and store data in database named favourites.

    app.post("/favouritesHotel", async (req, res) => {
      const favouritesHotel = req.body;
      const result = await favouritesHotelCollection.insertOne(favouritesHotel);
      res.send(result);
    });

    //  when user click on heart icon in  flights  will be set on favourite data and store data in database named favourites.
    app.post("/favouritesFlight", async (req, res) => {
      const favouritesFlight = req.body;
      const result = await favouritesFlightsCollection.insertOne(
        favouritesFlight
      );
      res.send(result);
    });

    //  when user click on favourite route   user can see his/her favourites  packages

    app.get("/favourites", async (req, res) => {
      const query = {};
      const result = await favouritesCollection.find(query).toArray();
      res.send(result);
    });

    // here is the code for delete your favourites data from dashboard

    app.delete("/favourites/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await favouritesCollection.deleteOne(query);
      res.send(result);
    });

    //  when user click on favourite route   user can see his/her favourites  hotels

    app.get("/favouritesHotel", async (req, res) => {
      const query = {};
      const result = await favouritesHotelCollection.find(query).toArray();
      res.send(result);
    });

    //  when user click on favourite route   user can see his/her favourites  flights

    app.get("/favouritesFlight", async (req, res) => {
      const favouritesFlight = req.body;
      const result = await favouritesFlightsCollection
        .find(favouritesFlight)
        .toArray();
      res.send(result);
    });

    app.delete("/favouritesFlight/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await favouritesFlightsCollection.deleteOne(query);
      res.send(result);
    });

    // see all bookings data after getting data from database

    app.get("/bookings", async (req, res) => {
      const query = {};
      const result = await bookingsCollection.find(query).toArray();
      res.send(result);
    });

    // get booking data by email. user log in with email and they can see their booking information

    app.get("/bookings/v2", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const userBookings = await bookingsCollection
        .find(query)
        .sort({ _id: -1 })
        .toArray();
      res.send(userBookings);
      console.log(userBookings);
    });

    app.get("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const bookedPackage = await bookingsCollection.findOne(query);
      res.send(bookedPackage);
      console.log(bookedPackage);
    });

    // user can delete their booking information use this code

    app.delete("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookingsCollection.deleteOne(query);
      res.send(result);
    });

    app.delete("/favouritesHotel/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await favouritesHotelCollection.deleteOne(query);
      res.send(result);
    });

    // here is the code for save user data when a user log in or signup and get user data to display.

    app.post("/users", async (req, res) => {
      const users = req.body;
      const result = await usersCollection.insertOne(users);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const query = {};
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    });

    // here is the code for get admin

    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isAdmin: user?.role === "admin" });
    });

    // =============make an user admin ================

    app.put("/users/admin/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    //============ rent-car-services ==============

    app.get("/rent-car-services", async (req, res) => {
      const query = {};
      const result = await rentCarServicesCollection.find(query).toArray();
      res.send(result);
    });

    // update date on database

    app.get("/addDate", async (req, res) => {
      const filter = {};
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          CheckIn: "03/29/2023",
          checkOUt: "04/29/2023",
        },
      };
      const result = await categoryCollection.updateMany(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
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
