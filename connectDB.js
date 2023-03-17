const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri =
    "mongodb+srv://user2:0kw4llp4OEF6BZGQ@cluster0.wuwpwwx.mongodb.net/?retryWrites=true&w=majority";
console.log(uri);
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

exports.connectDB = async () => {
    try {
        await client.connect()
        console.log('DataBase connection established successfully'.cyan.bold)
    }
    catch (err) { console.log(err.message.red.bold) }


}
exports.client = client

