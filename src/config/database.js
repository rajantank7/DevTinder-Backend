const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://rajantank7:dLLE5VxpLToI9TEI@devtinder.uem8spd.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
