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

router.post('/password-reset', async (req, res) => {
  let body = req.body;

  console.log(body);

  const user = await userModel.findOne({ email: body.email });

  if (!user)
    return res.status(401).json({
      statusCode: 401,
      message: 'User with this email does not  exists',
    });

  const oldPassword = user.password;

  const doesMatchOldPass =
    user.oldPasswords.some((oldPass) =>
      bcrypt.compareSync(body.password, oldPass)
    ) || bcrypt.compareSync(body.password, oldPassword);

  if (doesMatchOldPass)
    return res.status(409).json({
      statusCode: 409,
      message: 'You can not use an old password',
    });

  body = Object.assign(body, {
    password: bcrypt.hashSync(body.password, 14),
    lastPasswordUpdateDate: new Date(),
    $push: {
      oldPasswords: {
        $each: [oldPassword],
        $slice: -5,
      },
    },
  });

  await user.update(body, { new: true });

  return res.json({
    message: "User's password is shamefully changed",
  });
});

module.exports = router;
