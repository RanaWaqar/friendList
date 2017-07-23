//region require modules
const path = require("path");
const express = require('express');
const app = express();
const cors = require('cors');
const NODE_CONFIGRATIONS = require('./config/config');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const expValidator = require('express-validator');
//endregion

//region app.use
app.use(express.static('build'));
app.use(express.static('HTML'));
app.use(expValidator(expressvalidator()));
app.use(cors());



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())
const routes = require('./Application/routes');
app.use(routes);

app.use((req, res, next) => {
    console.log('------------------------------------------');
    console.log(req.url);
    return next();
});
//endregion

MongoClient.connect(NODE_CONFIGRATIONS.DB.PATH(), function (err, db) {
    if (err) {
        console.log({message: "db not connected" + err.message});
    } else {
        app.set("db", db);
        console.log("mongodb is connected");
    }


});
//main HTML route
app.get('/', function response(req, res) {
    res.sendFile('index.html', {root: path.join(__dirname, '/HTML')})
});



function expressvalidator() {
    return ({
        customValidators: {
            isArray: function (value) {
                return Array.isArray(value);
            },
            isArrayOfStrings: function (value) {
                if (!Array.isArray(value)) {
                    return false;
                }
                if (value.length < 1) {
                    return false;
                }

                var res = value.every(function (v) {
                    return (typeof v === 'string');
                });

                return res;
            }
        }
    });
}
//listen to an envoirment
app.listen(NODE_CONFIGRATIONS.PORT, () => {
    console.log("app is listening to " + NODE_CONFIGRATIONS.PATH());
});