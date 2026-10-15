
const test = require("node:test");
const assert = require("node:assert/strict");

const Trip = require("../src/models/Trip");
const Itinerary = require("../src/models/Itinerary");
const itineraryService = require("../src/services/itineraryService");

const trip = {
  _id: "trip-1",
  userId: "user-1",
  startDate: new Date("2026-11-01T00:00:00.000Z"),
  endDate: new Date("2026-11-03T00:00:00.000Z"),
};

const existingItinerary = {
  _id: "itinerary-1",
  tripId: "trip-1",
  userId: "user-1",
  day: 1,
  date: new Date("2026-11-01T00:00:00.000Z"),
  activities: [],
};

function mockMethod(t, object, method, implementation) {
  const original = object[method];
  object[method] = implementation;
  t.after(() => {
    object[method] = original;
  });
}

function mockTripLookup(t) {
  mockMethod(t, Trip, "findOne", async () => trip);
}

test("creates an itinerary when day matches its date", async (t) => {
  mockTripLookup(t);

  mockMethod(t, Itinerary, "create", async (data) => data);

  const result = await itineraryService.createItinerary("user-1", {
    tripId: "trip-1",
    day: 2,
    date: "2026-11-02",
    activities: [],
  });

  assert.equal(result.day, 2);
  assert.equal(result.tripId, "trip-1");
});

test("rejects an itinerary when day and date do not match", async (t) => {
  mockTripLookup(t);

  mockMethod(t, Itinerary, "create", async () => {
    assert.fail("Itinerary should not be created");
  });

  await assert.rejects(
    itineraryService.createItinerary("user-1", {
      tripId: "trip-1",
      day: 2,
      date: "2026-11-01",
      activities: [],
    }),
    /day must match its date/
  );
});

test("rejects an itinerary date before the trip starts", async (t) => {
  mockTripLookup(t);

  mockMethod(t, Itinerary, "create", async () => {
    assert.fail("Itinerary should not be created");
  });

  await assert.rejects(
    itineraryService.createItinerary("user-1", {
      tripId: "trip-1",
      day: 1,
      date: "2026-10-31",
      activities: [],
    }),
    /date must fall within the trip dates/
  );
});

test("rejects an invalid itinerary date", async (t) => {
  mockTripLookup(t);

  mockMethod(t, Itinerary, "create", async () => {
    assert.fail("Itinerary should not be created");
  });

  await assert.rejects(
    itineraryService.createItinerary("user-1", {
      tripId: "trip-1",
      day: 1,
      date: "not-a-date",
      activities: [],
    }),
    /Invalid itinerary date/
  );
});

test("rejects an update that changes the date but leaves the wrong day", async (t) => {
  mockMethod(t, Itinerary, "findOne", async () => existingItinerary);
  mockTripLookup(t);

  mockMethod(t, Itinerary, "findOneAndUpdate", async () => {
    assert.fail("Inconsistent itinerary should not be updated");
  });

  await assert.rejects(
    itineraryService.updateItinerary("user-1", "itinerary-1", {
      date: "2026-11-02",
    }),
    /day must match its date/
  );
});

test("allows an activities-only update when the existing day and date match", async (t) => {
  mockMethod(t, Itinerary, "findOne", async () => existingItinerary);
  mockTripLookup(t);

  mockMethod(t, Itinerary, "findOneAndUpdate", async (filter, update) => ({
    ...existingItinerary,
    ...update.$set,
  }));

  const result = await itineraryService.updateItinerary(
    "user-1",
    "itinerary-1",
    { activities: [{ title: "Visit the palace" }] }
  );

  assert.equal(result.day, 1);
  assert.equal(result.activities[0].title, "Visit the palace");
});
