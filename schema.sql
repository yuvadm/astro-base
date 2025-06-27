-- Create a simple tasks table for our POC
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample data
INSERT INTO tasks (title, description) VALUES 
  ('Set up Cloudflare Workers', 'Configure the worker environment'),
  ('Create D1 database', 'Set up the database schema'),
  ('Build API endpoints', 'Create REST API for tasks');