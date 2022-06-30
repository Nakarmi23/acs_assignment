// @ts-check;

const { default: axios } = require('axios');

const checkCaptcha = async (req, res, next) => {
  const body = req.body;

  if (!body.captcha)
    return res.status(400).json({
      status: 400,
      message: 'Captcha is required',
    });

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

  return next();
};

module.exports = checkCaptcha;
