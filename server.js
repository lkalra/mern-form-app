const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const csv = require("csv-writer").createObjectCsvWriter;
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 8000;
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
main().catch((err) => console.log(err));

async function main() {
  try {
    await mongoose.connect(
      "mongodb+srv://admin:admin@cluster0.iz7j0yr.mongodb.net/yesit"
    );
  } catch (err) {
    console.log(err);
  }
  console.log("database connected");
}

// Create a mongoose model
const formDataSchema = new mongoose.Schema({
  name: String,
  email: String,
  photo: String,
  phone: String,
  streetAddress: String,
  city: String,
  state: String,
  country: String,
});

const FormData = mongoose.model("FormData", formDataSchema);

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("uploads"));

// API endpoint to save form data
app.post("/api/form", upload.single("photo"), async (req, res) => {
  const { name, email, phone, streetAddress, city, state, country } = req.body;
  // console.log(req)
  const photo = req.file.filename;

  const newFormData = new FormData({
    name,
    email,
    photo,
    phone,
    streetAddress,
    city,
    state,
    country,
  });
  console.log(newFormData);
  let result = await newFormData.save().catch((err) => console.log(err));
  if (result) {
    res.status(201).send("Data saved successfully");
    console.log(result);
  } else {
    res.status(500).send(err);
  }
});
// API endpoint to get all form data
app.get("/api/form", async (req, res) => {
  try {
    let result = await FormData.find().catch((err) => console.log(err));
    if (result) {
      res.status(200).send({ data: result, msg: "Fetched data" });
    }
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

// API endpoint to export data in CSV format
app.get("/api/export-csv", async (req, res) => {
  try {
    const data = await FormData.find();

    // Check if data is empty
    if (data.length === 0) {
      res.status(404).send("No data found");
      return;
    }

    const csvWriter = csv({
      path: "./output.csv",
      header: [
        { id: "name", title: "name" },
        { id: "email", title: "email" },
        { id: "phone", title: "phone" },
        { id: "streetAddress", title: "streetAddress" },
        { id: "city", title: "city" },
        { id: "state", title: "state" },
        { id: "country", title: "country" },
      ],
    });

    csvWriter
      .writeRecords(data)
      .then(() => {
        console.log(data);
        res.download("output.csv");
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error generating CSV");
      });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
