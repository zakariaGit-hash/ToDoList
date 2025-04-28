const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Configuration de la base de données
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Connexion à MySQL et création de la base de données si elle n'existe pas
db.connect((err) => {
  if (err) throw err;
  console.log('Connecté à MySQL');

  // Créer la base de données si elle n'existe pas
  db.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, (err) => {
    if (err) throw err;
    console.log('Base de données créée ou déjà existante');

    // Utiliser la base de données
    db.query(`USE ${process.env.DB_NAME}`, (err) => {
      if (err) throw err;

      // Créer la table todos si elle n'existe pas
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS todos (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          completed BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      db.query(createTableQuery, (err) => {
        if (err) throw err;
        console.log('Table todos créée ou déjà existante');
      });
    });
  });
});

// Routes
app.get('/api/todos', (req, res) => {
  db.query('SELECT * FROM todos ORDER BY created_at DESC', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.post('/api/todos', (req, res) => {
  const { title } = req.body;
  if (!title) {
    res.status(400).json({ error: 'Le titre est requis' });
    return;
  }

  db.query('INSERT INTO todos (title) VALUES (?)', [title], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: result.insertId, title, completed: false });
  });
});

app.put('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  db.query(
    'UPDATE todos SET completed = ? WHERE id = ?',
    [completed, id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id, completed });
    }
  );
});

app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM todos WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Todo supprimé avec succès' });
  });
});

const PORT = process.env.PORT || 3008;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});