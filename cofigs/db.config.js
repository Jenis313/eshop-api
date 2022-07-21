const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const conxnURL = "mongodb://localhost:27017";
const dbName = "eshop_db";

module.exports = {
  MongoClient: MongoClient,
  conxnURL: conxnURL,
  dbName: dbName,
  OID: mongodb.ObjectID,
};
