const express = require('express');
const FlightController = require('../../controllers/API/FlightController');
const Middleware = require('../../middlewares/Middleware')
const router = express.Router();

//  route for api 
 /**
   * @api {get} /Get a test response 
   * @apiDescription test response with massage 
   * @apiPermission allusers
   *
   * @apiHeader {String} Don't need to send Header
   *
   * @apiParam  {*} Dont Have a QueryParam    
   *
   * @apiSuccess {Object[]} a succes response  .
   *
   * @apiError (Unauthorized 404)  can't get test response
   */
 router.get('/',FlightController.index)

 /**
  * @api {post} /Get the of flights 
  * @apiDescription Get all the flights
  * @apiPermission allusers
  *
  * @apiHeader {String} Don't need to send Header
  *
  * @apiParam  {Number{1-}}       [page=1]     Get the flight with retun trip
  * @apiParam  {Object{ } }       [pageConfig={"content":5,"page":1}]     Get the flight with retun trip
  * @apiParam  {Number{0-1}}      [return=1]     Get the flight with retun trip
  * @apiParam  {Number{0-1}}      [return=1]     Get the flight with retun trip
  * @apiParam  {Number{0-1}}      [cheapest=1]   Get the flight with low  cost 
  * @apiParam  {Number{0-1}}      [best=1]       Get the flight with   hight cost 
  * @apiParam  {Number{0-1}}      [quickest=1]   Get the flight  quickest flight 
  * @apiParam  {Object{ }}      [price={"min":180,"max":240}]   Get the flight  quickest flight 
  * @apiParam  {String }      [destination=Gümüssuyu Mah. Inönü Cad. No:8, Istanbul 34437]     Get the flight by destination name 
  * @apiParam  {String }      [location=Lahore - Dubai]     Get the flight by location name 
  * @apiParam  {String }      [airlines_name=flydubai]  Get the flight by airlines name
  *
  * @apiSuccess {Object[]} all the flights.
  *
  * @apiError (Unauthorized 404) Can't get flights 
  */
 router.get('/flights',FlightController.show)


module.exports= router