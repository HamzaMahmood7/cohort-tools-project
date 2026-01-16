const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Creating the cohort schema
// A schema describes and enforces the structure of the documents in a collection
// in this case: the cohorts collection

const cohortSchema = new Schema({
  cohortSlug: {
    type: String,
    required: true,
  },
  cohortName: {
    type: String,
    required: true,
  },

  program: {
    type: String,
    enum: ["Web Dev", "UX/UI", "Data Analytics", "Cybersecurity"],
  },
  format: {
    type: String,
    enum: ["Full Time", "Part Time"],
  },
  campus: {
    type: String,
    enum: [
      "Madrid",
      "Barcelona",
      "Miami",
      "Paris",
      "Berlin",
      "Amsterdam",
      "Lisbon",
      "Remote",
    ],
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
  inProgress: {
    type: Boolean,
    default: false,
  },

  programManager: {
    type: String,
    required: true,
  },
  leadTeacher: {
    type: String,
    required: true,
  },
  totalHours: {
    type: Number,
    default: 360,
  },
});
// Creating the Cohort model
// The model() method defines a model (Cohort) and creates a collection (cohorts) in MongoDB
const Cohort = mongoose.model("Cohort", cohortSchema);

// Export the model
module.exports = Cohort;
