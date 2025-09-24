# Hospital Management Backend

Backend services for the Hospital Management Website.  
The system is modular, split into 4 micro-APIs: Hospitals, Appointments, Health Campaigns, and Vaccinations.  

## 🛠 Tech Stack
- Node.js, Express.js  
- MongoDB, Mongoose  
- Multer (file uploads)  
- CORS  

## 🚀 Services & APIs

### 🏥 Hospitals API (Port 5500)
- **POST** `/register-hospital` → Register a hospital (with image & license upload)  
- **GET** `/hospitals` → Get all hospitals  
- **GET** `/hospital/:id` → Get hospital by ID  

### 📅 Appointments API (Port 5001)
- **POST** `/api/appointments/add` → Add patient appointment (auto confirm/waitlist logic)  
- **GET** `/api/appointments/all` → Get all appointments  

### 📢 Health Campaigns API (Port 5002)
- **POST** `/add-campaign` → Add a campaign (with image upload)  
- **GET** `/get-campaigns` → Get all campaigns  

### 💉 Vaccination API (Port 5000)
- **POST** `/api/vaccine-form` → Register vaccination details (hospital, disease, vaccine, dosage, age group, side effects, image upload)  
- **GET** `/api/vaccine-form-data` → Fetch all vaccination details  

## 🔧 Setup
1. Clone the repo  
   ```bash
   git clone https://github.com/Bhavyaprem777/hospital-management-website-backend.git
   cd hospital-management-backend
2.Install dependencies
npm install

3.Start MongoDB locally (or update connection string in code).

4.Run each service separately:

node server.js          # Hospitals API (Port 5500)
node appointment-details.js    # Appointments API (Port 5001)
node health-campaign-data-backend.js       # Health Campaigns API (Port 5002)
node vaccine-form-data-backend.js     # Vaccination API (Port 5000)
5. Live Demo (ONLY FRONTEND): https://hospital-management-website-kappa.vercel.app/
6.Video Demo: https://drive.google.com/file/d/1aTgXhJ2HGoeytixuiXCwQVlJ_aGggOV7/view
