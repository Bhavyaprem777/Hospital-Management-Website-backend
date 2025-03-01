const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads/vaccines", express.static(path.join(__dirname, "uploads/vaccines"))); // Serve images

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/HospitalDB_New02", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Define Mongoose Schema
const vaccineSchema = new mongoose.Schema({
    hospitalName: String,
    hospitalAddress: String,
    vaccinationDate: Date,
    vaccineName: String,
    disease: String,
    dosage: String,
    symptoms: String,
    sideEffects: String,  // New field for side effects
    ageGroup: String,
    imageUrl: String
});

// Create Mongoose Model
const Vaccine = mongoose.model("vaccinationDetails", vaccineSchema);

// Configure Multer for Image Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/vaccines"); // Save images in vaccines folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});
const upload = multer({ storage });

// Route to Handle Form Submission (POST Request)
app.post("/api/vaccine-form", upload.single("image"), async (req, res) => {
    try {
        const { hospitalName, hospitalAddress, vaccinationDate, vaccineName, disease, dosage, symptoms, sideEffects, ageGroup } = req.body;
        if (!hospitalName || !hospitalAddress || !vaccinationDate || !vaccineName || !disease || !dosage || !symptoms || !sideEffects || !ageGroup || !req.file) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const imageUrl = `/uploads/vaccines/${req.file.filename}`; // Save image path

        const newVaccine = new Vaccine({
            hospitalName,
            hospitalAddress,
            vaccinationDate,
            vaccineName,
            disease,
            dosage,
            symptoms,
            sideEffects,
            ageGroup,
            imageUrl
        });

        await newVaccine.save();
        res.status(201).json({ message: "✅ Vaccine details stored successfully!" });

    } catch (error) {
        console.error("Error storing vaccine details:", error);
        res.status(500).json({ message: "❌ Internal Server Error" });
    }
});

// Route to Fetch Vaccine Details (GET Request)
app.get("/api/vaccine-form-data", async (req, res) => {
    try {
        const vaccines = await Vaccine.find();
        res.json(vaccines);
    } catch (error) {
        console.error("Error fetching vaccine details:", error);
        res.status(500).json({ message: "❌ Internal Server Error" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
