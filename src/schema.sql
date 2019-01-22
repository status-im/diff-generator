CREATE TABLE IF NOT EXISTS builds (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  sha      VARCHAR(255),
  name     VARCHAR(255),
  url      VARCHAR(255),
  type     VARCHAR(255),
  filename VARCHAR(255),
  created  DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS diffs (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  options  VARCHAR(255),
  created  DATETIME NOT NULL,
  east     INTEGER REFERENCES builds(id),
  west     INTEGER REFERENCES builds(id)
);
