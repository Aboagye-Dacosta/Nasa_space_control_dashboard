const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

mongoose.connection.once("open", () => {
  console.log("MongoDB connection is open");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error: ", err);
});

function mongoConnect(PATH = process.env["PRO_DB_STRING"]) {
  mongoose.connect(PATH, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

function mongoDisconnect() {
  mongoose.disconnect();
}

module.exports = { mongoConnect, mongoDisconnect };
