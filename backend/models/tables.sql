CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('ADMIN', 'SPOC', 'TEAM_LEADER')),
  verified BOOLEAN DEFAULT false,
  phone VARCHAR(20)
);

CREATE TABLE colleges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150),
  spoc_id INT REFERENCES users(id)
);

CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  college_id INT REFERENCES colleges(id),
  leader_id INT REFERENCES users(id)
);

CREATE TABLE problem_statements (
  id SERIAL PRIMARY KEY,
  title TEXT,
  description TEXT,
  type VARCHAR(50),
  category VARCHAR(50)
);

CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  team_id INT REFERENCES teams(id),
  ps_id INT REFERENCES problem_statements(id),
  title TEXT,
  abstract TEXT,
  file_url TEXT,
  status VARCHAR(20)
);
