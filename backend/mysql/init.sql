CREATE DATABASE IF NOT EXISTS legal_case_db;
USE legal_case_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('ADMIN', 'ADVOCATE', 'ASSISTANT') NOT NULL DEFAULT 'ASSISTANT',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NULL,
  phone VARCHAR(50) NOT NULL,
  address VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NULL,
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  case_number VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  court_name VARCHAR(255) NOT NULL,
  judge_name VARCHAR(255) NOT NULL,
  status ENUM('OPEN', 'IN_PROGRESS', 'ON_HOLD', 'CLOSED') NOT NULL DEFAULT 'OPEN',
  filing_date DATE NOT NULL,
  next_hearing_date DATE NULL,
  client_id INT NOT NULL,
  advocate_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cases_client FOREIGN KEY (client_id) REFERENCES clients(id),
  CONSTRAINT fk_cases_advocate FOREIGN KEY (advocate_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS hearings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  case_id INT NOT NULL,
  hearing_date_time DATETIME NOT NULL,
  courtroom VARCHAR(255) NOT NULL,
  agenda VARCHAR(255) NOT NULL,
  outcome TEXT NULL,
  reminder_sent BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_hearings_case FOREIGN KEY (case_id) REFERENCES cases(id)
);

CREATE TABLE IF NOT EXISTS documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  file_name VARCHAR(255) NOT NULL,
  document_type VARCHAR(100) NOT NULL,
  content_type VARCHAR(100) NOT NULL DEFAULT 'application/pdf',
  size_bytes INT NOT NULL DEFAULT 0,
  case_id INT NOT NULL,
  uploaded_by_id INT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_documents_case FOREIGN KEY (case_id) REFERENCES cases(id),
  CONSTRAINT fk_documents_user FOREIGN KEY (uploaded_by_id) REFERENCES users(id)
);

INSERT IGNORE INTO users (id, full_name, email, password_hash, role) VALUES
  (1, 'System Administrator', 'admin@legalcase.local', 'Admin@123', 'ADMIN');

INSERT IGNORE INTO clients (id, full_name, email, phone, address, company_name, notes) VALUES
  (1, 'Acme Corp', 'legal@acme.com', '9999999999', 'Bangalore', 'Acme', 'Priority litigation client');

INSERT IGNORE INTO cases (id, case_number, title, description, court_name, judge_name, status, filing_date, next_hearing_date, client_id, advocate_id) VALUES
  (1, 'CIV-2026-1001', 'Acme Corp vs Horizon Logistics', 'Commercial dispute over service delays and damages.', 'High Court', 'Justice Sharma', 'OPEN', '2026-03-14', '2026-04-06', 1, 1);

INSERT IGNORE INTO hearings (id, case_id, hearing_date_time, courtroom, agenda, outcome, reminder_sent) VALUES
  (1, 1, '2026-04-06 11:00:00', 'Court Hall 2', 'Interim relief hearing', NULL, FALSE);

INSERT IGNORE INTO documents (id, file_name, document_type, content_type, size_bytes, case_id, uploaded_by_id) VALUES
  (1, 'Interim_Application.pdf', 'CASE_FILE', 'application/pdf', 245760, 1, 1);
