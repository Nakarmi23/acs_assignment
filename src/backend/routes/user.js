const { Router } = require('express');
const userModel = require('../models/user');
const bcrypt = require('bcrypt');
const authenticate = require('../middleware/authenticate');
const checkCaptcha = require('../middleware/checkCaptcha');
const rateLimitGenerator = require('../middleware/rateLimiter');

const router = Router();

router.post(
  '/register',
  rateLimitGenerator(),
  checkCaptcha,
  async (req, res) => {
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
  }
);

router.post(
  '/password-reset',
  rateLimitGenerator(),
  checkCaptcha,
  async (req, res) => {
    console.time('password-reset');
    let body = req.body;

    const user = await userModel.findOne({ email: body.email });

    if (!user)
      return res.status(401).json({
        statusCode: 401,
        message: 'User with this email does not  exists',
      });

    console.timeLog('password-reset', 'checking old pass');
    const oldPassword = user.password;

    // could use <Array>.some to check for old password. But using Promise.all is faster. using <Array>.some: total time 5.965s, using Promise.all: total time 3.104s
    // const doesMatchOldPass =
    //   user.oldPasswords.some((oldPass) =>
    //     bcrypt.compareSync(body.password, oldPass)
    //   ) || bcrypt.compareSync(body.password, oldPassword);

    const doesMatchOldPass =
      (await Promise.all(
        user.oldPasswords.map((oldPass) =>
          bcrypt.compare(body.password, oldPass)
        )
      ).then((val) => val.some(Boolean))) ||
      bcrypt.compareSync(body.password, oldPassword);

    if (doesMatchOldPass)
      return res.status(409).json({
        statusCode: 409,
        message: 'You can not use an old password',
      });
    console.timeLog('password-reset', 'checked old pass');

    console.timeLog('password-reset', 'updating user');
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

    console.timeEnd('password-reset');
    return res.json({
      message: "User's password is shamefully changed",
    });
  }
);

router.post(
  '/change-password',
  rateLimitGenerator(),
  authenticate,
  checkCaptcha,
  async (req, res) => {
    let body = req.body;
    const user = req.user;

    if (!bcrypt.compareSync(body.currentPassword, user.password)) {
      return res.status(401).json({
        statusCode: 401,
        message: 'Password is invalid',
      });
    }

    const oldPassword = user.password;

    // could use <Array>.some to check for old password. But using Promise.all is faster. using <Array>.some: total time 5.965s, using Promise.all: total time 3.104s
    // const doesMatchOldPass =
    //   user.oldPasswords.some((oldPass) =>
    //     bcrypt.compareSync(body.password, oldPass)
    //   ) || bcrypt.compareSync(body.password, oldPassword);

    const doesMatchOldPass =
      (await Promise.all(
        user.oldPasswords.map((oldPass) =>
          bcrypt.compare(body.password, oldPass)
        )
      ).then((val) => val.some(Boolean))) ||
      bcrypt.compareSync(body.password, oldPassword);

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

    const { password, oldPasswords, ...result } = (
      await userModel.findOneAndUpdate({ _id: user._id }, body, {
        new: true,
      })
    ).toObject();

    return res.json(result);
  }
);

module.exports = router;
