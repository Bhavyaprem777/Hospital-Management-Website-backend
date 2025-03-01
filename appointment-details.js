const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" })); // Allow requests from any origin

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/HospitalDB_New02", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected - Appointments API"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Define Appointment Schema
const appointmentSchema = new mongoose.Schema({
    hospitalName: { type: String, required: true },
    doctorName: { type: String, required: true },
    patientName: { type: String, required: true },
    gender: { type: String, required: true },
    patientAge: { type: Number, required: true },
    patientContact: { type: String, required: true },
    patientEmail: { type: String, required: true },
    patientSymptoms: { type: String, required: true },
    requestedTime: { type: String, required: true },
    finalTime: { type: String, default: null }, // If not confirmed, it's null
    status: { type: String, required: true },
    additionalComments: { type: String }
});

// Create Model (Collection: patientAppointments)
const PatientAppointment = mongoose.model("PatientAppointment", appointmentSchema, "patientAppointments");

// 📌 Route to add a new appointment
app.post("/api/appointments/add", async (req, res) => {
    try {
        const {
            hospitalName, doctorName, patientName, gender, patientAge,
            patientContact, patientEmail, patientSymptoms, requestedTime, additionalComments
        } = req.body;

        // Randomly confirm or waitlist appointment (70% confirmation chance)
        const isConfirmed = Math.random() > 0.3;
        const finalTime = isConfirmed ? requestedTime : null;
        const status = isConfirmed ? "Confirmed" : "Waiting List";

        const newAppointment = new PatientAppointment({
            hospitalName, doctorName, patientName, gender, patientAge,
            patientContact, patientEmail, patientSymptoms, requestedTime,
            finalTime, status, additionalComments
        });

        await newAppointment.save();
        res.json({ message: "✅ Appointment Successfully Created!", status });
    } catch (error) {
        console.error("❌ Error saving appointment:", error);
        res.status(500).json({ error: "Error saving appointment" });
    }
});

// 📌 Route to get all appointments
app.get("/api/appointments/all", async (req, res) => {
    try {
        const appointments = await PatientAppointment.find();
        res.json(appointments);
    } catch (error) {
        console.error("❌ Error fetching appointments:", error);
        res.status(500).json({ error: "Error fetching appointments" });
    }
});

// Start Server
const PORT = 5001;  // Different port than `server.js`
app.listen(PORT, () => console.log(`🚀 Appointments API running on port ${PORT}`));
