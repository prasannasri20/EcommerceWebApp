const express = require('express');
const db = require('../db');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Auth middleware
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// ✅ Add item to cart
router.post('/add', authMiddleware, (req, res) => {
  const { itemId, quantity } = req.body;
  const userId = req.user.id;

  const existing = db.prepare(`
    SELECT * FROM cart WHERE userId = ? AND itemId = ?
  `).get(userId, itemId);

  if (existing) {
    db.prepare(`
      UPDATE cart SET quantity = quantity + ? WHERE id = ?
    `).run(quantity, existing.id);
  } else {
    db.prepare(`
      INSERT INTO cart (userId, itemId, quantity) VALUES (?, ?, ?)
    `).run(userId, itemId, quantity);
  }

  res.json({ message: 'Item added to cart' });
});

// ✅ Remove item from cart
router.post('/remove', authMiddleware, (req, res) => {
  const { itemId } = req.body;
  const userId = req.user.id;
  console.log(itemId);
  console.log(userId);

 db.prepare(`
    DELETE FROM cart WHERE userId = ? AND itemId = ?
  `).run(userId, itemId);

  res.json({ message: 'Item removed from cart' });
});

// ✅ Get cart for current user
router.get('/', authMiddleware, (req, res) => {
  const userId = req.user.id;

  const cartItems = db.prepare(`
    SELECT c.id, c.quantity, i.name, i.description, i.price, i.category
    FROM cart c
    JOIN items i ON c.itemId = i.id
    WHERE c.userId = ?
  `).all(userId);

  res.json(cartItems);
});

module.exports = router;
