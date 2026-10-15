const test = require("node:test");
const assert = require("node:assert/strict");
const app = require("../src/app");

const server = app.listen(0, "127.0.0.1");
const baseUrl = new Promise((resolve) => server.once("listening", () => resolve(`http://127.0.0.1:${server.address().port}`)));

test("root health response is stable", async () => {
  const base = await baseUrl;
  const response = await fetch(`${base}/`);
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.success, true);
  assert.equal(body.status, "Backend is running");
});

test("health endpoint returns a healthy status", async () => {
  const base = await baseUrl;
  const response = await fetch(`${base}/api/health`);
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.status, "healthy");
});

test("unknown routes return consistent JSON 404", async () => {
  const base = await baseUrl;
  const response = await fetch(`${base}/not-a-real-route`);
  const body = await response.json();
  assert.equal(response.status, 404);
  assert.equal(body.success, false);
  assert.match(body.message, /Route not found/);
});

test("malformed JSON is reported as a client error", async () => {
  const base = await baseUrl;
  const response = await fetch(`${base}/api/auth/login`, { method: "POST", headers: { "content-type": "application/json" }, body: "{" });
  const body = await response.json();
  assert.equal(response.status, 400);
  assert.equal(body.message, "Malformed JSON request body");
});

test.after(() => new Promise((resolve) => server.close(resolve)));
