const { List } = require('../models');

exports.getAllLists = async (req, res, next) => {
  try {
    const lists = await List.findAll({ where: { userId: req.user.id } });
    res.json({ lists });
  } catch (err) {
    next(err);
  }
};

exports.getListById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const list = await List.findOne({ where: { id, userId: req.user.id } });
    res.json({ list });
  } catch (err) {
    next(err);
  }
};

exports.createList = async (req, res, next) => {
  try {
    const { title, status } = req.body;
    const list = await List.create({
      title,
      status,
      userId: req.user.id
    });
    res.status(201).json({ list });
  } catch (err) {
    next(err);
  }
};

exports.updateList = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, status } = req.body;
    const [rows] = await List.update(
      { title, status },
      {
        where: {
          id,
          userId: req.user.id
        }
      }
    );

    if (rows === 0) {
      return res.status(400).json({ message: 'fail to update list' });
    }

    res.status(200).json({ message: 'success update list' });
  } catch (err) {
    next(err);
  }
};

exports.deleteList = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rows = await List.destroy({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (rows === 0) {
      return res.status(400).json({ message: 'fail to delete list' });
    }

    res.status(204).json();
  } catch (err) {
    next(err);
  }
};
