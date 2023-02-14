const http = require("http");
const app = require("./app");
const { loadHabitablePlanetData } = require("./model/planets.model");

const PORT = process.env.PORT || 8000;
async function loadData() {
  await loadHabitablePlanetData();
}
loadData();

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
