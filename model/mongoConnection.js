const { MongoClient } = require("mongodb");
const config = require("../config/config");

const username = config.connection.mongo.username;
const password = config.connection.mongo.password;
const dbName = config.connection.mongo.dbName;


const mongoUrl = "your mongo connection url"

// Create a new MongoClient
const client = new MongoClient(mongoUrl);

// Connect to the MongoDB Atlas cluster
async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

function mongoClient() {
  return client;
}

module.exports = { connectToDatabase, mongoClient };
