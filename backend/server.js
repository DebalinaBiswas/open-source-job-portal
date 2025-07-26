const express = require('express');
const cors = require('cors');
const db = require('./db'); 

const app = express();
app.use(cors());
app.use(express.json());

//  Home route
app.get('/', (req, res) => {
  res.send('Open Source Job Portal API is running');
});

//  Test route
app.get('/test', (req, res) => {
  res.send("Server is working!");
});

//  User Registration
app.post('/register', (req, res) => {
  const { name, email, password, role } = req.body;

  const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
  db.query(query, [name, email, password, role], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Registration failed', details: err.message });
    }
    res.status(200).json({ message: 'User registered successfully' });
  });
});

//  User Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Login failed', details: err.message });
    }

    if (results.length > 0) {
      res.status(200).json({
        message: 'Login successful',
        user: results[0]
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  });
});
//  Post a new job
app.post('/post-job', (req, res) => {
  const { title, company, location, salary, description, posted_by, employer_email } = req.body;

  const query = 'INSERT INTO jobs (title, company, location, salary, description, posted_by, employer_email) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [title, company, location, salary, description, posted_by, employer_email], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to post job', details: err.message });
    }
    res.status(200).json({ message: 'Job posted successfully' });
  });
});

//  Get all jobs
app.get('/jobs', (req, res) => {
  const query = 'SELECT * FROM jobs ORDER BY posted_at DESC';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch jobs', details: err.message });
    }
    res.status(200).json(results);
  });
});
//  Apply for job route
app.post('/apply-job', (req, res) => {
  const { job_id, applicant_name, applicant_email, resume_link } = req.body;
  const query = 'INSERT INTO applications (job_id, applicant_name, applicant_email, resume_link) VALUES (?, ?, ?, ?)';
  db.query(query, [job_id, applicant_name, applicant_email, resume_link], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to submit application', details: err.message });
    }
    res.status(200).json({ message: 'Application submitted successfully' });
  });
});

app.post('/register', (req, res) => {
  const { name, email, password, role } = req.body;

  const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';

  db.query(query, [name, email, password, role], (err, result) => {
    if (err) {
      console.error("Registration error:", err);
      return res.status(500).json({ message: "Registration failed", error: err.message });
    }
    res.status(200).json({ message: "Registration successful" });
  });
});

app.get('/employer-jobs', (req, res) => {
  const email = req.query.email;
  const query = 'SELECT * FROM jobs WHERE employer_email = ?';

  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.delete('/delete-job/:id', (req, res) => {
  const jobId = req.params.id;
  const query = 'DELETE FROM jobs WHERE id = ?';

  db.query(query, [jobId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Job deleted successfully.' });
  });
});

app.get('/search-jobs', (req, res) => {
  const query = req.query.query || '';
  const type = req.query.type;

  let sql = "SELECT * FROM jobs WHERE (title LIKE ? OR location LIKE ?)";
  let params = [`%${query}%`, `%${query}%`];

  if (type) {
    sql += " AND job_type = ?";
    params.push(type);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Search failed', details: err.message });
    }
    res.json(results);
  });
});
app.get('/employer-jobs', (req, res) => {
  const email = req.query.email;

  const query = 'SELECT * FROM jobs WHERE posted_by = ?';

  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.delete('/delete-job/:id', (req, res) => {
  const jobId = req.params.id;
  const query = 'DELETE FROM jobs WHERE id = ?';

  db.query(query, [jobId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows > 0) {
      res.json({ message: 'Job deleted successfully' });
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  });
});

app.post('/update-seeker-profile', (req, res) => {
  const { user_id, contact, skills, work_history } = req.body;
  const query = `
    INSERT INTO seekers (user_id, contact, skills, work_history)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    contact = VALUES(contact),
    skills = VALUES(skills),
    work_history = VALUES(work_history)
  `;
  db.query(query, [user_id, contact, skills, work_history], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to update seeker profile', error: err.message });
    }
    res.status(200).json({ message: 'Seeker profile updated successfully' });
  });
});
app.get('/seeker-applications', (req, res) => {
  const email = req.query.email;

  const query = `
    SELECT a.*, j.title AS job_title, j.company
    FROM applications a
    LEFT JOIN jobs j ON a.job_id = j.id
    WHERE a.applicant_email = ?
  `;

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Seeker applications error:", err);
      return res.status(500).json({ message: 'Error loading applications', error: err.message });
    }
    res.json(results);
  });
});
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
