CREATE TABLE certificates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  certificate_unit TEXT,
  instrument_name TEXT,
  serial_number TEXT,
  asset_number TEXT,
  calibration_date TEXT,
  certificate_number TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  batch_id TEXT
  
);

CREATE TABLE cert_lookup (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  certificate_number TEXT, 
  certificate_unit TEXT,
  calibration_date TEXT,
  instrument_name TEXT,
  serial_number TEXT,
  asset_number TEXT,
  batch_id TEXT
);

CREATE TABLE certificates3 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  certificate_number TEXT,
  certificate_unit TEXT,
  certificate_type TEXT,
  instrument_name TEXT,
  model TEXT,
  serial_number TEXT,
  asset_number TEXT,
  manufacturer TEXT,
  calibration_date TEXT,
  calibration_personnel TEXT,
  batch_id TEXT
);
CREATE TABLE IF NOT EXISTS certificates_simple (
  id INTEGER PRIMARY KEY AUTOINCREMENT, 
  company TEXT NOT NULL, 
  device TEXT NOT NULL,
  serial TEXT, 
  management TEXT,
  calibration_date TEXT,
  certificate_number TEXT NOT NULL, 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  batch_id TEXT
);
