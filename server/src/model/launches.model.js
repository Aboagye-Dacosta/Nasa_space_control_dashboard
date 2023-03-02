const axios = require("axios");

const launches = require("./launches.mongo");
const planets = require("./planets.mongo");

const launchData = {
  launchId: 100, //flight_number
  mission: "Kepler Exploration X", //name
  rocket: "Explorer IS1", //rocket.name
  target: "Kepler-442 b", //not determined
  customers: ["ZTM", "NASA"], //payloads.customers
  launchDate: new Date("December 27, 2030"), //date_local
  upcoming: true, //upcoming
  success: true, //success
};

//Todo: getting number of launches from mongodb
async function launchesLength() {
  let count = 0;
  try {
    count = await launches.countDocuments();
  } catch (error) {
    console.error(`Sorry could not get number of launches: ${error}`);
  }

  return count;
}

//Todo: checking whether launch with id exists
async function existLaunchWithId(id) {
  try {
    const launch = await findLaunch({ flightNumber: id });
    return launch;
  } catch (error) {
    console.error(`Sorry could not get launch with id: ${error}`);
  }
}

//Todo: save launch to mongodb
async function createLaunch(launch) {
  let result = [];
  try {
    result = await launches.create(launch);
  } catch (error) {
    console.error(`Sorry could not save launch: ${error}`);
  }
  return result;
}

//Todo: find launch in mongodb
async function findLaunch(filter) {
  let data = [];
  try {
    data = await launches.find(filter, { _id: 0, __v: 0 });
  } catch (error) {
    console.error(`Sorry could not get all launches: ${error}`);
  }
  return data;
}

//Todo:  reading all launches from mongodb
//Todo: calls findLaunches function
async function readLaunches() {
  let data = [];
  try {
    data = await findLaunch({});
  } catch (error) {
    console.error(`Sorry could not get all launches: ${error}`);
  }
  return data;
}

//Todo: find and update launch in mongodb
async function updateLaunch(id) {
  let aborted = [];
  try {
    aborted = await launches.findOneAndUpdate(
      { flightNumber: id },
      { upcoming: false, success: false }
    );
  } catch (error) {
    console.error(`Sorry could not abort launch: ${error}`);
  }
  return aborted;
}

//Todo: adding new launch to mongodb
//Todo: calls saveLaunch function
async function addNewLaunch(launch) {
  const targetExists = await planets.find({ keplerName: launch.target });

  if (!targetExists) {
    return {
      error: "target does not exist in the solar system",
    };
  }
  // calculate new flight number
  const newFlightNumber = 100 + (await launchesLength());

  launch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    customers: ["ZMT", "NASA"],
    upcoming: true,
    success: true,
  });

  return await createLaunch(launch);
}

//Todo: aborting launch by id
//Todo: calls updateLaunch function
async function abortLaunchById(id) {
  const aborted = await updateLaunch(id);
  return aborted;
}

//Todo: getting all launches from mongodb
//Todo: calls readLaunches function
async function getAllLaunches() {
  const allLaunches = await readLaunches();
  return allLaunches;
}

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

//Todo: getting launches data from spacex api
async function spacexLaunches() {
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  const launchDocs = response.data.docs;

  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });

    const launchData = {
      flightNumber: launchDoc.flight_number,
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchDate: launchDoc.date_local,
      upcoming: launchDoc.upcoming,
      success: launchDoc.success,
      target: "Kepler-442 b",
      customers,
    };

    console.log(`${launchData.flightNumber} ${launchData.mission}`);
    await createLaunch(launchData);
  }
}

//Todo: loading launches data from spacex api
async function loadLaunchesData() {
  const launch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (launch.length !== 0) {
    console.log("Launch data already loaded");
    return;
  }

  await spacexLaunches();
}

function getNewLaunchKeys() {
  return ["mission", "rocket", "target", "launchDate"];
}

module.exports = {
  existLaunchWithId,
  getAllLaunches,
  addNewLaunch,
  getNewLaunchKeys,
  abortLaunchById,
  loadLaunchesData,
};
