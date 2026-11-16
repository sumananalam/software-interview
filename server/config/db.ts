import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'interviewmate.db');
console.log('Database path:', dbPath);
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

export function initDatabase() {
  // 1. users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      preferred_job_role TEXT DEFAULT 'Java Developer',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. job_roles table
  db.exec(`
    CREATE TABLE IF NOT EXISTS job_roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      icon TEXT DEFAULT 'Code'
    )
  `);

  // 3. interview_questions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS interview_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_role_id INTEGER,
      question_text TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      sample_answer TEXT,
      FOREIGN KEY (job_role_id) REFERENCES job_roles(id) ON DELETE CASCADE
    )
  `);

  // 4. interview_sessions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS interview_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      job_role_id INTEGER NOT NULL,
      interview_type TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      total_questions INTEGER NOT NULL,
      score REAL DEFAULT 0,
      status TEXT DEFAULT 'in_progress',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (job_role_id) REFERENCES job_roles(id) ON DELETE CASCADE
    )
  `);

  // 5. interview_answers table
  db.exec(`
    CREATE TABLE IF NOT EXISTS interview_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      question_id INTEGER NOT NULL,
      user_answer TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE,
      FOREIGN KEY (question_id) REFERENCES interview_questions(id) ON DELETE CASCADE
    )
  `);

  // 6. interview_feedback table
  db.exec(`
    CREATE TABLE IF NOT EXISTS interview_feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      question_id INTEGER NOT NULL,
      score REAL NOT NULL,
      strengths TEXT NOT NULL,
      missing_concepts TEXT NOT NULL,
      suggestions TEXT NOT NULL,
      sample_improved_answer TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE,
      FOREIGN KEY (question_id) REFERENCES interview_questions(id) ON DELETE CASCADE
    )
  `);

  // Seed default job roles if empty
  const roleCount = db.prepare('SELECT COUNT(*) as count FROM job_roles').get() as { count: number };
  if (roleCount.count === 0) {
    const insertRole = db.prepare('INSERT INTO job_roles (title, description, category, icon) VALUES (?, ?, ?, ?)');
    const roles = [
      ['Java Developer', 'Core Java, Spring Boot, Microservices, OOPs, Multithreading, and SQL.', 'Technical', 'Coffee'],
      ['Frontend Developer', 'React.js, TypeScript, CSS3/Tailwind, State Management, and Web Performance.', 'Technical', 'Layout'],
      ['Python Developer', 'Python fundamentals, Django/FastAPI, Data Structures, Algorithms, and APIs.', 'Technical', 'Terminal'],
      ['Full Stack Developer', 'Node.js, React, SQL/NoSQL databases, REST APIs, and System Design.', 'Technical', 'Layers'],
      ['Data Analyst', 'SQL, Python/Pandas, Data Visualization, Statistics, and Business Intelligence.', 'Technical', 'BarChart3'],
      ['HR & Behavioral', 'Communication, conflict resolution, teamwork, situational judgment, and career goals.', 'HR', 'Users']
    ];
    for (const r of roles) {
      insertRole.run(r[0], r[1], r[2], r[3]);
    }

    // Seed sample questions for each role
    const rolesList = db.prepare('SELECT id, title FROM job_roles').all() as { id: number; title: string }[];
    const insertQ = db.prepare('INSERT INTO interview_questions (job_role_id, question_text, difficulty, sample_answer) VALUES (?, ?, ?, ?)');

    for (const role of rolesList) {
      if (role.title === 'Java Developer') {
        insertQ.run(role.id, 'Explain the difference between JDK, JRE, and JVM in Java.', 'Beginner', 'JVM is the virtual machine executing bytecode. JRE contains JVM + class libraries. JDK contains JRE + development tools like compiler (javac).');
        insertQ.run(role.id, 'What are the key principles of Object-Oriented Programming in Java?', 'Beginner', 'Encapsulation, Inheritance, Polymorphism, and Abstraction.');
        insertQ.run(role.id, 'How does Spring Boot simplify enterprise application development?', 'Intermediate', 'Spring Boot provides starter dependencies, auto-configuration, and embedded servers, removing boilerplate XML and manual server configuration.');
        insertQ.run(role.id, 'Explain how HashMap works internally in Java.', 'Advanced', 'HashMap uses hashing with an array of buckets and linked lists or balanced trees (Java 8+) for collisions based on hashCode() and equals().');
        insertQ.run(role.id, 'What is the difference between synchronized, ReentrantLock, and volatile?', 'Advanced', 'volatile ensures visibility across threads. synchronized provides mutual exclusion. ReentrantLock offers advanced features like fairness, tryLock, and interruptible locks.');
      } else if (role.title === 'Frontend Developer') {
        insertQ.run(role.id, 'What is the Virtual DOM in React and how does it improve performance?', 'Beginner', 'Virtual DOM is an in-memory representation of real DOM elements. React uses diffing algorithms to update only changed nodes in real DOM.');
        insertQ.run(role.id, 'Explain useEffect hook and its dependency array.', 'Intermediate', 'useEffect handles side effects. Dependency array controls when effect runs: empty runs once on mount, populated re-runs on value changes.');
        insertQ.run(role.id, 'What are CSS Custom Properties and how do they differ from preprocessor variables?', 'Intermediate', 'CSS Custom properties are native to the browser, cascaded, inherit, and can be updated dynamically via JavaScript at runtime.');
        insertQ.run(role.id, 'How do you optimize a React web application for maximum performance?', 'Advanced', 'Use React.memo, useCallback, useMemo, code splitting with lazy/Suspense, image optimization, and virtualizing long lists.');
        insertQ.run(role.id, 'Explain CORS (Cross-Origin Resource Sharing) and how to resolve CORS issues.', 'Advanced', 'CORS is a security mechanism restricting cross-origin HTTP requests. Resolved via appropriate Access-Control-Allow-Origin headers on server or proxy configuration.');
      } else if (role.title === 'Python Developer') {
        insertQ.run(role.id, 'What are Python decorators and how do you write a custom decorator?', 'Intermediate', 'Decorators are callable functions modifying behavior of other functions/methods by wrapping them with pre/post execution logic.');
        insertQ.run(role.id, 'Explain the Global Interpreter Lock (GIL) in CPython.', 'Advanced', 'GIL is a mutex protecting access to Python objects, preventing multiple native threads from executing Python bytecodes simultaneously.');
        insertQ.run(role.id, 'What is the difference between list, tuple, and set in Python?', 'Beginner', 'List is mutable sequence. Tuple is immutable sequence. Set is unordered collection of unique elements.');
        insertQ.run(role.id, 'How does garbage collection work in Python?', 'Advanced', 'Python uses reference counting primarily, supplemented by a cyclic garbage collector to detect and collect reference cycles.');
        insertQ.run(role.id, 'Explain generators and the yield keyword in Python.', 'Intermediate', 'Generators yield values lazily one at a time using iterator protocol, saving memory for large datasets.');
      } else if (role.title === 'Full Stack Developer') {
        insertQ.run(role.id, 'How do you design a scalable RESTful API architecture?', 'Beginner', 'Use proper HTTP methods (GET, POST, PUT, DELETE), stateless authentication, resource-based URL routing, and clear JSON payloads.');
        insertQ.run(role.id, 'Explain SQL vs NoSQL databases and when to choose each.', 'Intermediate', 'SQL is relational, structured, ACID compliant (PostgreSQL/MySQL). NoSQL is schema-less, horizontal scaling, document/key-value (MongoDB/Redis).');
        insertQ.run(role.id, 'What is JWT (JSON Web Token) authentication and how does it work?', 'Intermediate', 'JWT is a compact, URL-safe means of representing claims securely between parties, signed cryptographically with a secret or key.');
        insertQ.run(role.id, 'Explain the concept of Database Indexing and how b-trees work.', 'Advanced', 'Indexes accelerate data retrieval. B-trees maintain sorted data with balanced multi-way search trees for efficient O(log n) lookups.');
        insertQ.run(role.id, 'How do you handle error handling and logging in a distributed microservices architecture?', 'Advanced', 'Use centralized logging, correlation IDs across requests, circuit breakers, and structured JSON error responses.');
      } else if (role.title === 'Data Analyst') {
        insertQ.run(role.id, 'Explain the difference between INNER JOIN, LEFT JOIN, and RIGHT JOIN in SQL.', 'Beginner', 'INNER JOIN returns matching rows from both tables. LEFT JOIN returns all rows from left table and matching from right.');
        insertQ.run(role.id, 'How do you handle missing or null data in a pandas DataFrame?', 'Intermediate', 'Identify missing data with isnull().sum(), then handle using dropna() or fillna() with mean, median, or forward fill.');
        insertQ.run(role.id, 'What is p-value and statistical significance in A/B testing?', 'Advanced', 'p-value measures probability of obtaining test results at least as extreme as observed results, assuming null hypothesis is true.');
        insertQ.run(role.id, 'Explain data normalization and why it is important.', 'Intermediate', 'Normalization organizes data to reduce redundancy and dependency by dividing large tables into smaller related tables.');
        insertQ.run(role.id, 'How do you design an effective executive dashboard?', 'Advanced', 'Focus on key performance indicators (KPIs), clear visual hierarchy, intuitive drill-downs, and actionable insights relevant to stakeholders.');
      } else if (role.title === 'HR & Behavioral') {
        insertQ.run(role.id, 'Tell me about yourself and your career background.', 'Beginner', 'Provide a concise overview of professional background, key achievements, technical skills, and career aspirations.');
        insertQ.run(role.id, 'Describe a challenging situation with a team member and how you resolved it.', 'Intermediate', 'Use STAR method (Situation, Task, Action, Result) highlighting active listening, empathy, and collaborative conflict resolution.');
        insertQ.run(role.id, 'Why do you want to join our company?', 'Beginner', 'Demonstrate company research, alignment with company mission, culture, values, and how skills can add immediate value.');
        insertQ.run(role.id, 'Describe a time when you failed and what you learned from it.', 'Intermediate', 'Discuss honest mistake, immediate ownership, corrective actions taken, and takeaways implemented for future success.');
        insertQ.run(role.id, 'Where do you see yourself professionally in five years?', 'Advanced', 'Express commitment to technical mastery, leadership growth, contributing to strategic company initiatives, and continuous learning.');
      }
    }
  }
}

export default db;
