const path = require("path");
const { getAllHabitablePlanets } = require("../../model/planets.model");

function httpGetAllPlanets(req, res) {
  return res.status(200).json(getAllHabitablePlanets());
}

module.exports = {
  httpGetAllPlanets,
};
