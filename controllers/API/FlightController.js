const { ObjectId } = require('mongodb')
const DB = require('../../connectDB');
const flights = DB.client.db('travel-agency').collection('flights');
// console.log(flights);
let lastTime = 0
let Information = []
const throttle = (fn, delay = 1000 * 60 * 10) => {
    return (...args) => {
        const now = new Date().getTime();
        if (now - lastTime < delay) { return };
        lastTime = now;
        fn(...args);
    }
}

const timeCal = (departure, arrival) => {
    const departureTime = departure.split(' ')
    const departureTimeHours = departureTime[1] === 'pm' ? JSON.parse(departureTime[0].split(':')[0]) + 12 : JSON.parse(departureTime[0].split(':')[0])
    const departureTimeMinute = departureTime[0].split(':')[1] == "00" ? 0 : JSON.parse(departureTime[0].split(':')[1])
    const departureTimeTotal = departureTimeHours * 60 + departureTimeMinute
    const arrivalTime = arrival.split(' ')
    const arrivalTimeTimeHours = arrivalTime[1] === 'pm' ? JSON.parse(arrivalTime[0].split(':')[0]) + 12 : JSON.parse(arrivalTime[0].split(':')[0])
    const arrivalTimeMinute = arrivalTime[0].split(':')[1] == "00" ? 0 : JSON.parse(arrivalTime[0].split(':')[1])
    const arrivalTimeTotal = arrivalTimeTimeHours * 60 + arrivalTimeMinute
    return arrivalTimeTotal - departureTimeTotal
}

const updateInfo = async () => {
    const allFlights = await flights.find({}).toArray()
    try {
        allFlights.map(item => {
            const tripTime = timeCal(item.time.departure, item.time.arrival)
            const returnTime = timeCal(item.return_time.departure, item.return_time.arrival)
            flights.updateOne({ "_id": new ObjectId(item._id) }, { $set: { "time.trip": tripTime, 'return_time.trip': returnTime } })
        })
        console.log(" Information Updated !!! ")
    } catch (error) {
        console.log(error)

    }
    Information = allFlights
}
// initialize connection 
const init = throttle(updateInfo); init()



exports.index = async (req, res) => {
    let result = {
        "massage": "welcome to taval-zone API. Here is the list of end point provide we provide",
        "end-point": ["flights",],
        "apiParam": [
            { "[page=1]": "{Number{1-}}       [page=1]     Get the flight with retun trip" }
        ]
    }
    res.send(result)
}
exports.show = async (req, res) => {
    const init = throttle(updateInfo); init()
    let filter = []
    let pageConfig = { content: 20, page: 1 }


    req.query.class ? filter.push({'class': req.query.class}) : null
    req.query.trip ? filter.push({'trip': req.query.trip}) : null


    req.query.return == 1 ? filter.push({ return: true }) : req.query.return == 0 ? filter.push({ return: false }) : null
    req.query.destination ? filter.push({ 'destination': req.query.destination }) : null
    req.query.location ? filter.push({ 'location': req.query.location }) : null
    req.query.airlines_name ? filter.push({ 'airlines_name': req.query.airlines_name }) : null
    req.query.page ? pageConfig['page'] = req.query.page : null
    if (req.query.price) {
        const price = JSON.parse(req.query.price)
        price.min ? filter.push({ 'price': { $gt: price.min } }) : null
        price.max ? filter.push({ 'price': { $lt: price.max } }) : null

    }
    if (req.query.pageConfig) {
        const Config = JSON.parse(req.query.pageConfig)
        pageConfig['content'] = Config.content || 10
        pageConfig['page'] = Config.page || 1
    }


    if (req.query.cheapest == 1) {
        let totalPrice = 0
        const price = await flights.find({}).toArray()
        price.map(item => { totalPrice = totalPrice + item.price })
        const average = totalPrice / price.length
        filter.push({ price: { $lt: average } })
    }
    if (req.query.best == 1) {
        let totalPrice = 0
        Information.map(item => { totalPrice = totalPrice + item.price })
        const average = totalPrice / Information.length
        filter.push({ price: { $gt: average } })
    }


    if (req.query.quickest == 1) {
        let totalTripTime = 0
        Information.map(item => {
            totalTripTime = totalTripTime + item.time.trip

        })
        const averageTripTime = totalTripTime / Information.length
        filter.push({ 'time.trip': { $lt: averageTripTime } })
    }


    const result = await flights.find(Object.keys(filter).length === 0 ? {} : { $and: filter }, { sort: { _id: -1 } }).limit(pageConfig.content).skip(pageConfig.content * (pageConfig.page - 1)).toArray()
    const response = {
        massage: "this is the 20 flights ",
        page: pageConfig.page,
        data: result
    }
    res.send(response)
}

