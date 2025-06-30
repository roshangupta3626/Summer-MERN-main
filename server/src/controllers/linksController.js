const Links = require("../models/Links");

const linksController = {
  create: async (req, res) => {
    const { campaignTitle, originalUrl, category } = req.body;
    if (!campaignTitle || !originalUrl || !category) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const link = new Links({
        campaignTitle,
        originalUrl,
        category,
        clickCount: 0,
        user: req.user.id,
      });
      await link.save();
      res.status(201).json({ message: 'Link created', data: { linkId: link._id } });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getAll: async (req, res) => {
    try {
      const links = await Links.find({ user: req.user.id }).sort({ createdAt: -1 });
      res.json({ data: links });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getById: async (req, res) => {
    try {
      const link = await Links.findById(req.params.id);
      if (!link || link.user.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Unauthorized or not found' });
      }
      res.json({ data: link });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  update: async (req, res) => {
    const { campaignTitle, originalUrl, category } = req.body;
    try {
      const link = await Links.findById(req.params.id);
      if (!link || link.user.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Unauthorized or not found' });
      }

      link.campaignTitle = campaignTitle;
      link.originalUrl = originalUrl;
      link.category = category;
      await link.save();

      res.json({ data: link });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  delete: async (req, res) => {
    try {
      const link = await Links.findById(req.params.id);
      if (!link || link.user.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Unauthorized or not found' });
      }
      await link.deleteOne();
      res.json({ message: 'Link deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  redirect: async (req, res) => {
    try {
      const link = await Links.findById(req.params.id);
      if (!link) {
        return res.status(404).json({ error: 'Link not found' });
      }
      link.clickCount += 1;
      await link.save();
      res.redirect(link.originalUrl);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = linksController;
