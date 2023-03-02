const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");
const planets = require("./planets.mongo");

//checking whether planet is habitable
const isHabitablePlanet = function (planet) {
  return (
    planet["koi_disposition"] == "CONFIRMED" &&
    planet["koi_prad"] < 1.6 &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11
  );
};

//loading planets from csv file and saving them to mongodb
function loadHabitablePlanetData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      //parsing csv file to json using csv-parse
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", (data) => {
        if (isHabitablePlanet(data)) {
          savePlanets(data);
        }
      })
      .on("error", (error) => {
        console.log(error);
        reject(err);
      })
      .on("end", async () => {
        console.log(`${await getPlanetsLength()} habitable planets found!`);
        resolve();
      });
  });
}

//getting number of planets from mongodb
async function getPlanetsLength() {
  try {
    return await planets.countDocuments({});
  } catch (error) {
    console.error(`Sorry could not get number of planets: ${error}`);
  }
}

//getting all habitable planets from mongodb
async function getAllHabitablePlanets() {
  let habitablePlanets = [];
  try {
    habitablePlanets = await planets.find({}, { __v: 0, _id: 0 });
  } catch (error) {
    console.error(`Sorry could not get habitable planets: ${error}`);
  }
  return habitablePlanets;
}

//saving planet to mongodb
async function savePlanets(planet) {
  // try {
  await planets.updateOne(
    {
      keplerName: planet.kepler_name,
    },
    {
      keplerName: planet.kepler_name,
    },
    {
      upsert: true,
    }
  );
  // } catch (error) {
  //   console.error(`Sorry could not save planet: ${error}`);
  // }
}

module.exports = {
  loadHabitablePlanetData,
  getAllHabitablePlanets,
};
