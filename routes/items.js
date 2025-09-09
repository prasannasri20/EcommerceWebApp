const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/test', (req, res) => {
  console.log('✅ /api/items/test route hit');
  res.send('Test route working');
});


// ✅ Create item
router.post('/', (req, res) => {
  const { name, description, price, category } = req.body;

  const result = db.prepare(`
    INSERT INTO items (name, description, price, category)
    VALUES (?, ?, ?, ?)
  `).run(name, description, price, category);

  const item = db.prepare('SELECT * FROM items WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(item);
});

// ✅ Get all items with filters
// ✅ Get all items with filters (category, price, search)



router.get('/', (req, res) => {
  
  const { category, priceMin, priceMax, search } = req.query;
  

  let query = 'SELECT * FROM items WHERE 1=1';  // moved before logging
  const params = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  if (priceMin) {
    query += ' AND price >= ?';
    params.push(Number(priceMin));
  }

  if (priceMax) {
    query += ' AND price <= ?';
    params.push(Number(priceMax));
  }

  if (search) {
    console.log(search);
    query += ' AND LOWER(name) LIKE ?';
    params.push(`%${search.toLowerCase()}%`);
  }

  
  const items = db.prepare(query).all(...params);

  res.json(items);
});


// ✅ Get single item
router.get('/:id', (req, res) => {
  const item = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json(item);
});

// ✅ Update item
router.put('/:id', (req, res) => {
  const { name, description, price, category } = req.body;

  const result = db.prepare(`
    UPDATE items SET name = ?, description = ?, price = ?, category = ?
    WHERE id = ?
  `).run(name, description, price, category, req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({ message: 'Item not found' });
  }

  const updatedItem = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);
  res.json(updatedItem);
});

// ✅ Delete item
router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM items WHERE id = ?').run(req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({ message: 'Item not found' });
  }

  res.json({ message: 'Item deleted' });
});

module.exports = router;
