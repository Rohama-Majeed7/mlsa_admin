const express = require('express');
const TeamMember = require('../models/TeamMember');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const members = await TeamMember.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Team member not found.' });
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, designation } = req.body;
    if (!name || !designation) {
      return res.status(400).json({ message: 'Name and designation are required.' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Member image is required.' });
    }

    const member = await TeamMember.create({
      name,
      designation,
      image: `/uploads/${req.file.filename}`,
    });

    res.status(201).json(member);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, designation } = req.body;
    const update = { name, designation };
    if (req.file) update.image = `/uploads/${req.file.filename}`;

    const member = await TeamMember.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!member) return res.status(404).json({ message: 'Team member not found.' });
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: 'Team member not found.' });
    res.json({ message: 'Team member deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;
