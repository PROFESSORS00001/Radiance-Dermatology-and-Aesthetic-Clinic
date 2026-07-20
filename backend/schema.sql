-- users
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL, -- Admin, Receptionist, Doctor, Lab Scientist, Pharmacy, Nurse
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- settings
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- patients
CREATE TABLE IF NOT EXISTS patients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  gender TEXT,
  dob DATE,
  address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- appointments
CREATE TABLE IF NOT EXISTS appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER,
  doctor_id INTEGER,
  purpose TEXT, -- Treatment, New Patient Consultation, Follow-up Consultation
  date DATE,
  time TEXT,
  status TEXT, -- Scheduled, Approved, Rescheduled, Completed, Cancelled
  booking_fee REAL,
  paid BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(patient_id) REFERENCES patients(id),
  FOREIGN KEY(doctor_id) REFERENCES users(id)
);

-- consultations
CREATE TABLE IF NOT EXISTS consultations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  appointment_id INTEGER,
  doctor_id INTEGER,
  patient_id INTEGER,
  date DATE,
  
  -- Demographics at time of consultation
  age_group TEXT,
  gender TEXT,
  residence_type TEXT,
  
  -- Presenting Complaint
  presenting_complaints_json TEXT, -- array of ticked complaints
  primary_complaint TEXT,
  
  -- Duration
  illness_duration TEXT,
  illness_history_type TEXT, -- new, recurring, etc
  
  -- Diagnosis
  working_diagnosis TEXT,
  diagnostic_confidence TEXT,
  disease_category TEXT,
  severity TEXT,
  
  -- Treatment Given (Immediate actions)
  treatment_given_json TEXT,
  
  -- Follow Up
  follow_up_needed TEXT,
  follow_up_interval TEXT,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(appointment_id) REFERENCES appointments(id),
  FOREIGN KEY(doctor_id) REFERENCES users(id),
  FOREIGN KEY(patient_id) REFERENCES patients(id)
);

-- treatment_catalog
CREATE TABLE IF NOT EXISTS treatment_catalog (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  treatment_name TEXT UNIQUE NOT NULL,
  price REAL DEFAULT 0
);

-- ordered_treatments
CREATE TABLE IF NOT EXISTS ordered_treatments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  consultation_id INTEGER,
  patient_id INTEGER,
  doctor_id INTEGER,
  treatment_name TEXT,
  price REAL,
  status TEXT DEFAULT 'Pending', -- Pending, Administered
  nurse_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(consultation_id) REFERENCES consultations(id),
  FOREIGN KEY(patient_id) REFERENCES patients(id),
  FOREIGN KEY(doctor_id) REFERENCES users(id),
  FOREIGN KEY(nurse_id) REFERENCES users(id)
);

-- lab_catalog
CREATE TABLE IF NOT EXISTS lab_catalog (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  test_name TEXT UNIQUE NOT NULL,
  price REAL DEFAULT 0
);

-- lab_orders
CREATE TABLE IF NOT EXISTS lab_orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  consultation_id INTEGER,
  patient_id INTEGER,
  doctor_id INTEGER,
  test_name TEXT,
  price REAL,
  status TEXT DEFAULT 'Pending', -- Pending, Completed
  result TEXT,
  lab_scientist_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(consultation_id) REFERENCES consultations(id),
  FOREIGN KEY(patient_id) REFERENCES patients(id),
  FOREIGN KEY(doctor_id) REFERENCES users(id),
  FOREIGN KEY(lab_scientist_id) REFERENCES users(id)
);

-- pharmacy_inventory
CREATE TABLE IF NOT EXISTS pharmacy_inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT, -- Topical, Oral, Injectable, Shampoos, Cleansers
  sub_category TEXT, -- Corticosteroids, Antibiotics, etc.
  drug_name TEXT UNIQUE NOT NULL,
  price REAL DEFAULT 0,
  stock INTEGER DEFAULT 100
);

-- prescriptions
CREATE TABLE IF NOT EXISTS prescriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  consultation_id INTEGER,
  patient_id INTEGER,
  doctor_id INTEGER,
  drug_name TEXT,
  frequency TEXT,
  route TEXT,
  duration TEXT,
  instructions TEXT,
  price REAL,
  status TEXT DEFAULT 'Pending', -- Pending, Administered (by nurse) / Dispensed (by pharmacy)
  nurse_id INTEGER,
  dispensed_by INTEGER,
  is_paid BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(consultation_id) REFERENCES consultations(id),
  FOREIGN KEY(patient_id) REFERENCES patients(id),
  FOREIGN KEY(doctor_id) REFERENCES users(id),
  FOREIGN KEY(nurse_id) REFERENCES users(id),
  FOREIGN KEY(dispensed_by) REFERENCES users(id)
);

-- nursing_logs
CREATE TABLE IF NOT EXISTS nursing_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER,
  nurse_id INTEGER,
  vitals_json TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(patient_id) REFERENCES patients(id),
  FOREIGN KEY(nurse_id) REFERENCES users(id)
);

-- billing
CREATE TABLE IF NOT EXISTS billing (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER,
  consultation_id INTEGER,
  items_json TEXT, -- array of {name, type, cost}
  total_amount REAL,
  status TEXT DEFAULT 'Unpaid', -- Unpaid, Paid
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(patient_id) REFERENCES patients(id),
  FOREIGN KEY(consultation_id) REFERENCES consultations(id)
);
