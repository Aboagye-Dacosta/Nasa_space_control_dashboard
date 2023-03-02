const http = require("http");

const app = require("./app");
const { loadHabitablePlanetData } = require("./model/planets.model");
const { loadLaunchesData } = require("./model/launches.model");
const { mongoConnect } = require("./services/mongo");

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

async function startServer() {
  mongoConnect();
  await loadHabitablePlanetData();
  await loadLaunchesData();
  server.listen(PORT, () => {
    console.log(`server is running on port: ${PORT}`);
  });
}

startServer();
