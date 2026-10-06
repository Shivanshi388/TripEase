const Destination = require("../models/Destination");

const getDestinations = async (req, res) => {
  const destinations = await Destination.find().sort({ name: 1 });

  res.json({
    count: destinations.length,
    destinations,
  });
};

const getDestinationById = async (req, res) => {
  const destination = await Destination.findById(req.params.id);

  if (!destination) {
    return res.status(404).json({
      message: "Destination not found",
    });
  }

  res.json(destination);
};

module.exports = {
  getDestinations,
  getDestinationById,
};