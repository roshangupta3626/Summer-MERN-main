const Links = require("../models/Links");

const linksController = {
  create: async (req, res) => {
    const { campaignTitle, originalUrl, category } = req.body;

    if (!campaignTitle || !originalUrl || !category) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const userId = req.user.role === 'admin' ? req.user._id : req.user.adminId;

      const link = new Links({
        campaignTitle,
        originalUrl,
        category,
        views: 0,
        createdBy: userId
      });

      await link.save();

      res.status(201).json({
        message: 'Link created',
        data: { linkId: link._id }
      });
    } catch (error) {
      console.error('Create Error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getAll: async (req, res) => {
    try {
      const userId = req.user.role === 'admin' ? req.user._id : req.user.adminId;

      const links = await Links.find({ createdBy: userId }).sort({ createdAt: -1 });

      res.json({ data: links });
    } catch (error) {
      console.error('Get All Error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getById: async (req, res) => {
    try {
      const link = await Links.findById(req.params.id);
      const userId = req.user.role === 'admin' ? req.user._id : req.user.adminId;

      if (!link || link.createdBy.toString() !== userId.toString()) {
        return res.status(403).json({ error: 'Unauthorized or not found' });
      }

      res.json({ data: link });
    } catch (error) {
      console.error('Get By ID Error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  update: async (req, res) => {
    const { campaignTitle, originalUrl, category } = req.body;

    try {
      const link = await Links.findById(req.params.id);
      const userId = req.user.role === 'admin' ? req.user._id : req.user.adminId;

      if (!link || link.createdBy.toString() !== userId.toString()) {
        return res.status(403).json({ error: 'Unauthorized or not found' });
      }

      link.campaignTitle = campaignTitle || link.campaignTitle;
      link.originalUrl = originalUrl || link.originalUrl;
      link.category = category || link.category;

      await link.save();

      res.json({ message: 'Link updated', data: link });
    } catch (error) {
      console.error('Update Error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  delete: async (req, res) => {
    try {
      const link = await Links.findById(req.params.id);
      const userId = req.user.role === 'admin' ? req.user._id : req.user.adminId;

      if (!link || link.createdBy.toString() !== userId.toString()) {
        return res.status(403).json({ error: 'Unauthorized or not found' });
      }

      await link.deleteOne();

      res.json({ message: 'Link deleted successfully' });
    } catch (error) {
      console.error('Delete Error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  redirect: async (req, res) => {
    try {
      const link = await Links.findById(req.params.id);

      if (!link) {
        return res.status(404).json({ error: 'Link not found' });
      }

      link.views += 1;
      await link.save();

      res.redirect(link.originalUrl);
    } catch (error) {
      console.error('Redirect Error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = linksController;
