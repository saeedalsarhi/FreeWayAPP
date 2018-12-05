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

async function onload(req, res) {
    stationsObjList = await stationCollection.find({}).toArray();
    var stationNameList = new Array();
    for(var i = 0; i < stationsObjList.length; i++){
        stationNameList.push(stationsObjList[i].locationtext);
    }
    res.json({ stationNames: stationNameList });
}
app.post('/populate', jsonParser, onload);


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

    //Find the station's avg Speed and total volume for the selected start and end Date/Time.
    var totalSpeed = 0;
    var totalVolume = 0;
    var avgSpeed = 0;
    var travelTime = 0;
    for (var i = 0; i < result.length; i++){
        
        if (result[i].speed === '')
            result[i].speed = 0;
        
        if (result[i].volume === '')
            result[i].volume = 0;

        totalVolume += result[i].volume;
        totalSpeed += result[i].speed
        avgSpeed = (totalSpeed) / (result.length);
    }
    
    // Find the length of the Station User is looking for.
    lengthResult = await stationCollection.findOne({
        locationtext: stationName
    });
    
    if(lengthResult !== null){
        //Calculate the travel time
        stationLength = lengthResult.length;
        travelTime = ((stationLength) / (avgSpeed)) * 3600;
    }
    else
        console.log('Station Doesn\'t exist');
    
    res.json({ travelTime: travelTime, totalVolume: totalVolume });
}
app.post('/calc', jsonParser, onCalculate);

// Update the name of the station
async function onUpdate(req, res) {
    const routeParams = req;
    const oldStationName = routeParams.body.oldStationName;
    const newStationName = routeParams.body.newStationName;
    response = await stationCollection.updateOne( { locationtext: oldStationName }, { $set: { locationtext: newStationName } } );
}
app.post('/save', jsonParser, onUpdate);
