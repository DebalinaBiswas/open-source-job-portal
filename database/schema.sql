-- Select the database
USE job_portal_open_source;

-- USERS TABLE: All registered users (seekers and employers)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role ENUM('seeker', 'employer') NOT NULL
);

-- JOBS TABLE: Job postings by employers
CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    company VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    salary VARCHAR(100),
    description TEXT,
    posted_by VARCHAR(100),
    posted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    employer_email VARCHAR(100),
    deadline DATE,
    job_type VARCHAR(50)
);

-- APPLICATIONS TABLE: Job applications by seekers
CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    applicant_name VARCHAR(100) NOT NULL,
    applicant_email VARCHAR(100) NOT NULL,
    resume_link TEXT NOT NULL,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

-- SEEKERS TABLE: Extended profile info for seekers
CREATE TABLE IF NOT EXISTS seekers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    contact VARCHAR(15),
    skills TEXT,
    work_history TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- EMPLOYERS TABLE: (currently not used, but exists in DB)
CREATE TABLE IF NOT EXISTS employers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    company_name VARCHAR(100),
    contact_email VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
