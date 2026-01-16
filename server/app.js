const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;

const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/cohort-tools-api")
  .then((x) => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to MongoDB", err));

// importing the models
const CohortModel = require("./models/cohort.model");
const StudentModel = require('./models/student.model')

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
const cohortsData = require("./cohorts.json");
const studentsData = require("./students.json");
// ...

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
const cors = require("cors");

app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);
// ...
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

app.get("/cohorts", (req, res) => {
  res.json(cohortsData);
});

// COHORT ROUTES
// create a new cohort
app.post("/api/cohorts", (req, res) => {
  CohortModel.create(req.body)
    .then((data) => {
      console.log("cohort was added to the DB", data);
      res.status(201).json(data);
    })
    .catch((error) => {
      console.error("Error while creating cohort", error);
      res.status(500).json({ error: "failed to create cohort" });
    });
});

// Get /cohorts - Retrieve all the cohorts from the database
app.get("/api/cohorts", (req, res) => {
  CohortModel.find({})
    .then((cohorts) => {
      console.log("retrieved cohorts: ", cohorts);
      res.json(cohorts);
      res.status(200);
    })
    .catch((error) => {
      console.error("Error while retrieving cohorts", error);
      res.status(500).json({ error: "failed to retrieve cohorts" });
    });
});

// Get a specific cohort via its id
app.get("/api/cohorts/:cohortId", async (req, res) => {
  try {
    const foundThisCohort = await CohortModel.findById(req.params.cohortId);
    console.log("the cohort: ", foundThisCohort);
    res.status(200).json(foundThisCohort);
  } catch (error) {
    console.error("Error while retrieving specific cohort", error);
    res.status(500).json({ error: "failed to retrieve this cohort" });
  }
});

// Update a specific cohort
app.put("/api/cohorts/:cohortId", async (req, res) => {
  try {
    const foundThisCohort = await CohortModel.findByIdAndUpdate(
      req.params.cohortId,
      req.body,
      { new: true }
    );
    console.log("updated the cohort: ", foundThisCohort);
    res.status(201).json(foundThisCohort);
  } catch (error) {
    console.error("Error while updating this specific cohort", error);
    res.status(500).json({ error: "failed to update this cohort" });
  }
});

app.delete("/api/cohorts/:cohortId", (req, res) => {
  CohortModel.findByIdAndDelete(req.params.cohortId)
    .then((data) => {
      console.log("deleted this cohort: ", data);
      res.status(200).json(data);
    })
    .catch((error) => {
      console.error("Error while deleting this specific cohort", error);
      res.status(500).json({ error: "failed to delete this cohort" });
    });
});

// STUDENT ROUTES
app.get("/students", (req, res) => {
  res.json(studentsData);
});

// create a new student
app.post("/api/students", (req, res) => {
  StudentModel.create(req.body)
    .then((data) => {
      console.log("student was added to the DB", data);
      res.status(201).json(data);
    })
    .catch((error) => {
      console.error("Error while creating student", error);
      res.status(500).json({ error: "failed to create student" });
    });
});

// Get /students - Retrieve all the students from the database
app.get("/api/students", (req, res) => {
  StudentModel.find().populate("cohort")
    .then((students) => {
      console.log("retrieved cohorts: ", cohorts);
      res.json(students);
      res.status(200);
    })
    .catch((error) => {
      console.error("Error while retrieving students", error);
      res.status(500).json({ error: "failed to retrieve students" });
    });
});


app.get("/api/students/:studentId", async (req, res) => {
  try {
    const student = await StudentModel.findById(req.params.studentId).populate(
      "cohort"
    );
    res.json(student);
  } catch (err) {
    res.status(404).json({ error: "Student not found" });
  }
});

app.get("/api/students/cohort/:cohortId", async (req, res) => {
  try {
    const students = await StudentModel.find({
      cohort: req.params.cohortId,
    }).populate("cohort");

    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/students/:studentId", async (req, res) => {
  try {
    const updatedStudent = await StudentModel.findByIdAndUpdate(
      req.params.studentId,
      req.body,
      { new: true }
    );
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


app.delete("/api/students/:studentId", async (req, res) => {
  try {
    await StudentModel.findByIdAndDelete(req.params.studentId);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
