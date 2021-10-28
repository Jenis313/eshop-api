const dbConfig = require('./cofigs/db.config');
/*const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const conxnURL = 'mongodb://localhost:27017';
const dbName = 'group37db';
This variables will be imported in dbConfig
*/
const mongoose = require('mongoose'); //Load mongoose
const conxnURL = dbConfig.conxnURL + '/' + dbConfig.dbName; //URL for connection database using mongoose
//Let's connect database using mongoose.
mongoose.connect(conxnURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true 
    
},  (err, result) => {
    if(err){
        console.log("ERROR in DB connection");
        //We don't put next here because we don't have the scope of next and also more importantly we don't require next() because it not like mongodb where database is connected only after users do something, in this case first database is connected by us developer so we just do console.log err to make sure the database is connected first
    }
    else{
        console.log("db connection successful");
    }
}) 

//WE don't export anything here we just require whole code wherever we'd like to use the database connection