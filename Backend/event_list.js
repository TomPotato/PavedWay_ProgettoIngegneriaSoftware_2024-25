const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Event = require("../models/Event");
const EventsList = require("../models/EventsList");
const Duration = require("../models/Duration");
const Location = require("../models/Location");

// Endpoint per ottenere la lista degli eventi
router.get('/event', async (req, res) => {
  try {
    const events = await EventsList.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});