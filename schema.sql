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
  calibration_personnel TEXT
);
CREATE TABLE IF NOT EXISTS certificates_simple (
  id INTEGER PRIMARY KEY AUTOINCREMENT,         -- 自增主键
  company TEXT NOT NULL,                         -- 公司名称
  device TEXT NOT NULL,                          -- 设备名称
  serial TEXT,                                   -- 出厂编号
  management TEXT,                               -- 管理编号
  calibration_date TEXT,                         -- 检/校日期（建议使用 YYYY-MM-DD）
  certificate_number TEXT NOT NULL,              -- 证书编号
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 创建时间
);
