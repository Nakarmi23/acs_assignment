const { Router } = require('express');
const userModel = require('../models/user');
const bcrypt = require('bcrypt');

const router = Router();

router.post('/', async (req, res) => {
  const body = req.body;

  const newUser = new userModel(body);
  newUser.password = bcrypt.hashSync(newUser.password, 14);

  return newUser
    .save()
    .then(() => {
      return res.status(201).json(newUser);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(409).json({
          code: 11000,
          message: 'User already exists',
          duplicateKeys: Object.keys(err.keyPattern),
        });
      }
      throw err;
    });
});

module.exports = router;
