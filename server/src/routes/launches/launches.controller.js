const {
  getAllLaunches,
  addNewLaunch,
  getNewLaunchKeys,
  abortLaunchById,
  existLaunchWithId,
} = require("../../model/launches.model");

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
  let launch = req.body;
  // checking whether the request body is empty
  if (Object.keys(launch).length === 0)
    return res.status(400).json({
      code: 400,
      error: "empty request body",
    });

  for (let i = 0; i < getNewLaunchKeys().length; i++) {
    const value = getNewLaunchKeys()[i];

    if (!launch[value])
      return res.status(400).json({
        code: 400,
        error: "field required",
        field: value,
      });
  }

  if (isNaN(new Date(launch["launchDate"])))
    return res.status(400).json({
      code: 400,
      error: "invalid field format",
      field: "launchDate",
    });

  launch.launchDate = new Date(launch.launchDate);

  addNewLaunch(launch);
  return res.status(201).json(launch);
}

function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);

  if (!existLaunchWithId(launchId))
    return res.status(404).json({
      error: "launch not found",
    });

  const aborted = abortLaunchById(launchId);
  res.status(200).json(aborted);
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
