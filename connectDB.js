const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wuwpwwx.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

exports.connectDB = async () => {
  try {
    await client.connect();
    console.log("DataBase connection established successfully".cyan.bold);
  } catch (err) {
    console.log(err.message.red.bold);
  }
};
exports.client = client;
