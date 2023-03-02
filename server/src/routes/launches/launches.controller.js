const {
  getAllLaunches,
  addNewLaunch,
  getNewLaunchKeys,
  abortLaunchById,
  existLaunchWithId,
} = require("../../model/launches.model");


//Todo: getting all launches from mongodb
async function httpGetAllLaunches(req, res) {
  const launches = await getAllLaunches();
  return res.status(200).json(launches);
}


//Todo: adding new launch to mongodb
async function httpAddNewLaunch(req, res) {
  let launch = req.body;
  // checking whether the request body is empty
  if (Object.keys(launch).length === 0)
    return res.status(400).json({
      code: 400,
      error: "empty request body",
    });

  // checking whether the request body has all required fields
  for (let i = 0; i < getNewLaunchKeys().length; i++) {
    const value = getNewLaunchKeys()[i];

    if (!launch[value])
      return res.status(400).json({
        code: 400,
        error: "field required",
        field: value,
      });
  }

  // checking whether the launch date is a valid date
  if (isNaN(new Date(launch["launchDate"])))
    return res.status(400).json({
      code: 400,
      error: "invalid field format",
      field: "launchDate",
    });

  // converting the launch date to a valid date
  launch.launchDate = new Date(launch.launchDate);
  return res.status(201).json( await addNewLaunch(launch));
}

//Todo: aborting launch by id
async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);

  if (!(await existLaunchWithId(launchId)))
    return res.status(404).json({
      error: "launch not found",
    });

  const aborted = await abortLaunchById(launchId);
  res.status(200).json(aborted);
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
