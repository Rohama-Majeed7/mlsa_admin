const express = require('express');
const Event = require('../models/Event');
// const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found.' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, url } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Event image is required.' });
    }

    const baseURL = `${req.protocol}://${req.get('host')}`;
    const event = await Event.create({
      title,
      description,
      url: url || '',
      image: `${baseURL}/uploads/${req.file.filename}`,
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, description, url } = req.body;
    const update = { title, description, url: url || '' };
    if (req.file) {
      const baseURL = `${req.protocol}://${req.get('host')}`;
      update.image = `${baseURL}/uploads/${req.file.filename}`;
    }

    const event = await Event.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!event) return res.status(404).json({ message: 'Event not found.' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found.' });
    res.json({ message: 'Event deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;
