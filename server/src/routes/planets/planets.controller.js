const { getAllHabitablePlanets } = require("../../model/planets.model");

async function httpGetAllPlanets(req, res) {
  const response = await getAllHabitablePlanets();
  return res.status(200).json(response);
}

module.exports = {
  httpGetAllPlanets,
};
