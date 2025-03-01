const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads")); // Serve uploaded images

// Ensure 'uploads/health_campaigns/' directory exists
const uploadDir = "uploads/health_campaigns/";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/HospitalDB_New02", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Connection Error:", err));

// Define Schema for Health Campaigns (Without 'location' field)
const campaignSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: String,
    startTime: String,
    endTime: String,
    organizer: String,
    organizerContact: String,
    attendees: Number,
    address: String,
    image: String // Store image file path
});

// Create Model
const HealthCampaign = mongoose.model("HealthCampaign", campaignSchema, "healthCampaigns");

// Configure Multer for Image Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);  // Save images in the folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Unique filename
    }
});

const upload = multer({ storage: storage });

// Route to Add a New Campaign (With Image Upload)
app.post("/add-campaign", upload.single("image"), async (req, res) => {
    try {
        const { title, description, date, startTime, endTime, organizer, organizerContact, attendees, address } = req.body;
        const imagePath = req.file ? `/uploads/health_campaigns/${req.file.filename}` : null; // Save image path

        const newCampaign = new HealthCampaign({
            title,
            description,
            date,
            startTime,
            endTime,
            organizer,
            organizerContact,
            attendees: parseInt(attendees, 10), // Convert to number
            address,
            image: imagePath
        });

        await newCampaign.save();
        res.status(201).json({ message: "Campaign added successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error adding campaign", error });
    }
});

// Route to Fetch All Campaigns
app.get("/get-campaigns", async (req, res) => {
    try {
        const campaigns = await HealthCampaign.find();
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ message: "Error fetching campaigns", error });
    }
});

// Start Server on Port 5002
app.listen(5002, () => console.log("Server running on port 5002"));
