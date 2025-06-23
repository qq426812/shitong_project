CREATE TABLE certificates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  certificate_unit TEXT,
  instrument_name TEXT,
  serial_number TEXT,
  asset_number TEXT,
  calibration_date TEXT,
  certificate_number TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cert_lookup (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  certificate_number TEXT, 
  certificate_unit TEXT,
  calibration_date TEXT,
  instrument_name TEXT,
  serial_number TEXT,
  asset_number TEXT
);
