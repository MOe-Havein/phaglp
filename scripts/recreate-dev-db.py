import sqlite3, os

db = "prisma/dev.db"
if os.path.exists(db):
    os.remove(db)

con = sqlite3.connect(db)
cur = con.cursor()
cur.executescript("""
CREATE TABLE IF NOT EXISTS User (
  id TEXT PRIMARY KEY,
  email TEXT,
  name TEXT,
  image TEXT,
  password TEXT,
  emailVerified INTEGER,
  createdAt DATETIME,
  updatedAt DATETIME,
  lecturePreferences TEXT,
  aiModel TEXT DEFAULT 'cohere-command-a-reasoning'
);
CREATE TABLE IF NOT EXISTS Account (
  id TEXT PRIMARY KEY,
  userId TEXT,
  type TEXT,
  provider TEXT,
  providerAccountId TEXT,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  createdAt DATETIME,
  updatedAt DATETIME
);
CREATE TABLE IF NOT EXISTS Session (
  id TEXT PRIMARY KEY,
  sessionToken TEXT,
  userId TEXT,
  expires DATETIME
);
CREATE TABLE IF NOT EXISTS VerificationToken (
  identifier TEXT,
  token TEXT,
  expires DATETIME
);
CREATE TABLE IF NOT EXISTS Course (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT,
  title TEXT,
  description TEXT,
  createdAt DATETIME,
  updatedAt DATETIME
);
CREATE TABLE IF NOT EXISTS Module (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  courseId INTEGER,
  title TEXT,
  "order" INTEGER,
  createdAt DATETIME,
  updatedAt DATETIME
);
CREATE TABLE IF NOT EXISTS Lesson (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  moduleId INTEGER,
  title TEXT,
  content TEXT,
  "order" INTEGER,
  createdAt DATETIME,
  updatedAt DATETIME
);
CREATE TABLE IF NOT EXISTS AnalyticsEvent (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  eventName TEXT,
  metadata TEXT,
  userId TEXT,
  createdAt DATETIME
);
CREATE TABLE IF NOT EXISTS SiteSettings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE,
  value TEXT
);
CREATE TABLE IF NOT EXISTS NavigationMenu (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  url TEXT,
  "order" INTEGER,
  visible INTEGER DEFAULT 1
);
""")
con.commit()
print("created", db)
