const { Router } = require('express');
const userModel = require('../models/user');
const bcrypt = require('bcrypt');
const axios = require('axios');

const router = Router();

router.post('/login', async (req, res) => {
  const body = req.body;
  const user = await userModel.findOne({ email: body.email });

  if (!user || !bcrypt.compareSync(body.password, user.password)) {
    return res.status(401).json({
      statusCode: 401,
      message: 'Username or Password is invalid',
    });
  }

  const reCaptchaRes = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=6LdIJocgAAAAAPWNShL8hrq9noGqrwK2oy3j_1ev&response=${body.captcha}`,
    {},
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  if (reCaptchaRes.data.success !== true)
    return res.status(422).json({
      statusCode: 422,
      message: 'Captcha is either expired, duplicate or invalid',
    });

  const { password, oldPasswords, ...result } = user.toObject();

  return res.json(result);
});

module.exports = router;
