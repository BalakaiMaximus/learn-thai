const uri = process.env.ATLAS_URI;
const mongoose = require("mongoose");
 
var _db;
 
module.exports = {
  connectToMongoose: function () { 
    mongoose.connect(
      uri,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: process.env.DB_NAME || 'bootstrap_app'  // Configurable via environment variable
      }
    )
    .then(() => {
      console.log("Successfully connected to MongoDB Atlas!");
    })
    .catch((error) => {
      console.log("Unable to connect to MongoDB Atlas!");
      console.error(error);
    });
  },
 
  getDb: function () {
    return _db;
  },
};