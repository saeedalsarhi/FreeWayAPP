/*
 * Homework 4 (CS 453)
 * ---------------------------
 *
 * The following code stubs are incomplete. Your job is to complete the
 * functions and achieve the desired functionality described in the comments.
 * Please don't change the names of given functions and object properties, as
 * the autograder will treat them as missing and you will get a zero.
 *
 * While completing this assignment, be sure to use Mozilla Developer Network's
 * [JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference).
 */


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
 * Complete the startDbAndServer function, which connects to the MongoDB
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
 * Complete the onSaveCard function, which takes in an HTTP request 'req'.
 * 'req' is sent when _onFormSubmit in "public/js/creator-view.js" is executed. 
 * The request sends 'const params = {style: this.style, message: this.message}'
 * to the Node server.
 * 
 * After receiving the request, the Node server should save it in the 'card' collection
 * in MongoDB and return the document ID as the 'cardID'. 
 *
 * 'res' is the response which contains a json object. 
 */
async function onCalculate(req, res) {
    console.log('This is calc');
    const routeParams = req;
    const startDate = routeParams.body.startDate;
    const endDate = routeParams.body.endDate;
    const stationName = routeParams.body.stationName;
    console.log(stationName);
    doc = {
        starttime: startDate,
        // endDate: endDate,
        // locationtext: stationName
    };
    // console.log(req);
    response = await loopDataCollection.findOne(doc);
    console.log(response);
    // res.json({ cardId: response.insertedId });
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

/*
 * Complete the onGetCard function, which takes in an HTTP request 'req'.
 * 'req' is sent when _loadCard() in "public/js/card-view.js" is executed
 * or when a URL (e.g., http://localhost:3000/id/5bbb8a07ebbf6a9cf4d839f5)
 * is entered in your browser. The request sends a cardID to the Node server.
 * The cardID is also a document ID in MongoDB.
 *
 * After receiving the request, the Node server should search the cardID in
 * the 'card' collection and return the content of the stored document matching
 * the cardID to the browser.
 */ 

async function onGetCard(req, res) {
    query = req.params.cardId;
    var o_id = ObjectID(query);
    response = await collection.findOne({ _id: o_id});

    const result = {
        style: response.style,
        message: response.message
    };
    res.json(result);
}
app.get('/get/:cardId', onGetCard);

async function onGetCardView(req, res) {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
}
app.get('*', onGetCardView);
