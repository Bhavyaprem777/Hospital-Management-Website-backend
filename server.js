const express = require('express');
const multer = require('multer');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const { ObjectId } = require('mongodb'); // To handle MongoDB ObjectId

const app = express();

// Setup middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
const dbName = 'HospitalDB_New02';
const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
let hospitalCollection;

// Connect to MongoDB and initialize the collection
client.connect().then(() => {
    const db = client.db(dbName);
    hospitalCollection = db.collection('hospitals');
    console.log('Connected to MongoDB');
});

// Setup multer storage for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/images'); // Save images in this folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Use unique names for image files
    }
});

const upload = multer({ storage: storage });

// Middleware to serve static files (images)
app.use('/uploads', express.static('uploads')); // Serve files from 'uploads' directory

// Route for hospital registration
app.post('/register-hospital', upload.fields([{ name: 'image' }, { name: 'license' }]), async (req, res) => {
    // Ensure the file was uploaded correctly
    console.log('Files uploaded:', req.files);
    
    // Constructing image URL dynamically
    let imageUrl = null;
    if (req.files['image']) {
        imageUrl = `/uploads/images/${req.files['image'][0].filename}`;
    }

    const hospitalData = {
        name: req.body.name,
        location: req.body.location,
        phone: req.body.phone,
        email: req.body.email,
        regNo: req.body.regNo,
        govtID: req.body.govtID,
        website: req.body.website,
        owner: req.body.owner,
        openingTime: req.body.opening,
        closingTime: req.body.closing,
        image: imageUrl, // Image URL saved correctly
        doctors: JSON.parse(req.body.doctors) // Doctors data
    };

    console.log('Hospital data:', hospitalData); // Debugging to see the final data before saving to MongoDB

    // Save hospital data to MongoDB
    try {
        await hospitalCollection.insertOne(hospitalData);
        res.json({ success: true, message: 'Hospital registered successfully', data: hospitalData });
    } catch (error) {
        console.error('Error inserting data into MongoDB:', error);
        res.status(500).json({ success: false, message: 'Error registering hospital' });
    }
});

// Route to fetch all hospitals
app.get('/hospitals', async (req, res) => {
    try {
        const hospitals = await hospitalCollection.find().toArray(); // Fetch hospitals from DB
        res.json(hospitals); // Send back the hospitals data as JSON
    } catch (error) {
        console.error('Error fetching hospitals:', error);
        res.status(500).json({ success: false, message: 'Error fetching hospitals' });
    }
});

// Route to get a single hospital by ID
app.get('/hospital/:id', async (req, res) => {
    const hospitalId = req.params.id; // Get hospital ID from URL parameter
    try {
        const hospital = await hospitalCollection.findOne({ _id: new ObjectId(hospitalId) }); // Fetch the hospital details

        if (hospital) {
            res.json(hospital); // Send the hospital details as JSON response
        } else {
            res.status(404).json({ message: 'Hospital not found' });
        }
    } catch (error) {
        console.error('Error fetching hospital:', error);
        res.status(500).json({ message: 'Error fetching hospital' });
    }
});

// Start the server
const port = 5500;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
