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
  owner_user_id INT NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NULL,
  phone VARCHAR(50) NOT NULL,
  address VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NULL,
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_clients_owner FOREIGN KEY (owner_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS cases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_user_id INT NOT NULL,
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
  CONSTRAINT fk_cases_owner FOREIGN KEY (owner_user_id) REFERENCES users(id),
  CONSTRAINT fk_cases_client FOREIGN KEY (client_id) REFERENCES clients(id),
  CONSTRAINT fk_cases_advocate FOREIGN KEY (advocate_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS hearings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_user_id INT NOT NULL,
  case_id INT NOT NULL,
  hearing_date_time DATETIME NOT NULL,
  courtroom VARCHAR(255) NOT NULL,
  agenda VARCHAR(255) NOT NULL,
  outcome TEXT NULL,
  reminder_sent BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_hearings_owner FOREIGN KEY (owner_user_id) REFERENCES users(id),
  CONSTRAINT fk_hearings_case FOREIGN KEY (case_id) REFERENCES cases(id)
);

CREATE TABLE IF NOT EXISTS documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_user_id INT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  document_type VARCHAR(100) NOT NULL,
  content_type VARCHAR(100) NOT NULL DEFAULT 'application/pdf',
  size_bytes INT NOT NULL DEFAULT 0,
  document_url VARCHAR(1000) NULL,
  summary TEXT NULL,
  case_id INT NOT NULL,
  uploaded_by_id INT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_documents_owner FOREIGN KEY (owner_user_id) REFERENCES users(id),
  CONSTRAINT fk_documents_case FOREIGN KEY (case_id) REFERENCES cases(id),
  CONSTRAINT fk_documents_user FOREIGN KEY (uploaded_by_id) REFERENCES users(id)
);

ALTER TABLE clients ADD COLUMN IF NOT EXISTS owner_user_id INT NOT NULL DEFAULT 1;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS owner_user_id INT NOT NULL DEFAULT 1;
ALTER TABLE hearings ADD COLUMN IF NOT EXISTS owner_user_id INT NOT NULL DEFAULT 1;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS owner_user_id INT NOT NULL DEFAULT 1;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS document_url VARCHAR(1000) NULL;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS summary TEXT NULL;
