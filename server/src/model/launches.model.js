const launches = new Map();
let newFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer 1S1",
  launchDate: new Date("December 27,2030"),
  target: "kepler-443 b",
  customers: ["ZMT", "NASA"],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

function existLaunchWithId(id) {
  return launches.has(id);
}

function getAllLaunches() {
  return Array.from(launches.values());
}

function addNewLaunch(launch) {
  newFlightNumber += 1;

  launch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    customers: ["ZMT", "NASA"],
    upcoming: true,
    success: true,
  });

  launches.set(newFlightNumber, launch);
}

function abortLaunchById(id) {
  const aborted = launches.get(id);
  aborted.upcoming = false;
  aborted.success = false;

  return aborted;
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
};
