const test = require("node:test");
const assert = require("node:assert/strict");
const app = require("../src/app");

const server = app.listen(0);

test("GET / returns the API welcome message", async () => {
  const address = server.address();
  const response = await fetch(`http://127.0.0.1:${address.port}/`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.status, "Backend is running");
  assert.equal(body.message, "Welcome to TripEase API!");
});

test("GET /api/health returns healthy status", async () => {
  const address = server.address();
  const response = await fetch(
    `http://127.0.0.1:${address.port}/api/health`
  );
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.success, true);
  assert.equal(body.status, "healthy");
  assert.equal(body.service, "TripEase Backend");
});

test.after(() => {
  server.close();
});
