const express = require('express');
const mysql = require('mysql');

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// MySQL Connection
const connection = mysql.createConnection({
  host: 'localhost', // Replace with your MySQL host
  user: 'kongjai', 
  password: 'Kj98114022', // Replace with your MySQL password
  database: 'nodekokkok' // Replace with your MySQL database name
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

app.post('/products', (req, res) => {
  const { name, price } = req.body;

  const query = 'INSERT INTO product (name, price) VALUES (?, ?)';
  connection.query(query, [name, price], (err, result) => {
    if (err) throw err;
    res.status(201).json({ id: result.insertId, name, price });
  });
});

// Get all 
app.get('/products', (req, res) => {
  const query = 'SELECT * FROM product';
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Get a specific product by ID
app.get('/products/:id', (req, res) => {
  const productId = req.params.id;
  const query = 'SELECT * FROM product WHERE id = ?';
  connection.query(query, [productId], (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.json(results[0]);
    }
  });
});

// update
app.put('/products/:id', (req, res) => {
  const productId = req.params.id;
  const { name, price } = req.body;

  const query = 'UPDATE product SET name = ?, price = ? WHERE id = ?';
  connection.query(query, [name, price, productId], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.json({ id: productId, name, price });
    }
  });
});

// Delete 
app.delete('/products/:id', (req, res) => {
  const productId = req.params.id;
  const query = 'DELETE FROM product WHERE id = ?';
  connection.query(query, [productId], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.sendStatus(204);
    }
  });
});