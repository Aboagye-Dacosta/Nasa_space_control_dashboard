// Load planets and return as JSON.
const BASE_URL = "http://localhost:8000";

async function httpGetPlanets() {
  const response = await fetch(`${BASE_URL}/planets`);
  return await response.json();
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const response = await fetch(`${BASE_URL}/launches`);
  const launches = await response.json();
  return launches.sort((a, b) => a.flightNumber - b.flightNumber);
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  try {
    return fetch(`${BASE_URL}/launches`, {
      method: "POST",
      body: JSON.stringify(launch),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return {
      ok: false,
    };
  }
}

async function httpAbortLaunch(id) {
  try {
    return await fetch(`${BASE_URL}/launches/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.log(error);
    return {
      ok: false,
    };
  }
  // Delete launch with given ID.
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
