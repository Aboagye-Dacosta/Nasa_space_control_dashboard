const mongoose = require("mongoose");

// Define the Planet schema
const planetSchema = new mongoose.Schema({
  keplerName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Planet", planetSchema);
