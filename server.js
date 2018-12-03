const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongodb = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const MONGO_URL = 'mongodb://localhost:27017/freeway';

const app = express();
const jsonParser = bodyParser.json();

app.use(express.static('public'));

/*
 * The startDbAndServer function, connects to the MongoDB
 * server and creates a Node web server listening to port 3000.
 */
 let db = null;
async function startDbAndServer() {
    db = await mongodb.connect(MONGO_URL);
    //All collections in the freeway database
    detectorsCollection = db.collection('freeway_detectors');
    loopDataCollection  = db.collection('freeway_loopdata');
    stationCollection   = db.collection('freeway_stations');
    highwayCollection   = db.collection('highways');
    
    await app.listen(3000);
    console.log('Listening on port 3000');
};

startDbAndServer();

////////////////////////////////////////////////////////////////////////////////

/*
 * The onCalculate function, which takes in an HTTP request 'req'.
 * 'req' is sent when _onFormSubmit in "public/js/calculationView.js" is executed. 
 * The request sends 'const params = {startDate: this.startDate, endDate: this.endDate, stationName: this.stationName}'
 * to the Node server.
 * 
 * After receiving the request, the Node server should calculate the travel time and total volume
 * using the collections in MongoDB and return the travel time and total volume as 'travelTime, totalVolume'. 
 *
 * 'res' is the response which contains a json object. 
 */
async function onCalculate(req, res) {
    const routeParams = req;
    const startDate = routeParams.body.startDate;
    const endDate = routeParams.body.endDate;
    const stationName = routeParams.body.stationName;

    detectors = await detectorsCollection.find({ locationtext: stationName }).toArray();
    var listOfDetectors = new Array();
    for (var i = 0; i < detectors.length; i++) {
        listOfDetectors.push(detectors[i].detectorid);
    }

    result = (await loopDataCollection.find( { 
        $and:   [ 
                    { detectorid: { "$in": listOfDetectors } },
                    { $and : [ {starttime: { "$gte": startDate } } , { starttime: { "$lte": endDate } } ] }
                ]    
    } ).toArray());

    //Find the avg Speed for the selected start and end Date/Time.
    var totalSpeed = 0;
    for (var i = 0; i < result.length; i++){
        
        if (result[i].speed === '')
            result[i].speed = 0;
        
            totalSpeed += result[i].speed
            avgSpeed = (totalSpeed) / (result.length);
    }
    
    // Find the length of the Station User is looking for.
    lengthResult = await stationCollection.findOne({
        locationtext: stationName
    });
    stationLength = lengthResult.length;

    //Calculate the travel time
    travelTime = ((stationLength)/(avgSpeed)) * 3600;
    
    res.json({ travelTime: travelTime, totalVolume: '5' });
}
app.post('/calc', jsonParser, onCalculate);

// Update the name of the station
async function onUpdate(req, res) {
    const routeParams = req;
    const oldStationName = routeParams.body.oldStationName;
    const newStationName = routeParams.body.newStationName;
    doc = {
        locationtext: oldStationName
    };
    response = await stationCollection.findOne(doc);
    remove = await stationCollection.remove(doc);
    response.locationtext = newStationName;
    insert = await stationCollection.insertOne(response);
}
app.post('/save', jsonParser, onUpdate);
