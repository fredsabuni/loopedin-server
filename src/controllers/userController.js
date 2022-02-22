const jwt = require('jsonwebtoken')
const { User } = require('../models')
const config = require('../config/config')

function jwtSignUser(user) {
  const ONE_WEEK = 7 * 24 * 60 * 60; 
  return jwt.sign(user, config.JwtSecret, {
    expiresIn: ONE_WEEK
  }) 
}

module.exports = {
  findByID: (req, res) => {
    const { user } = req;
    if (!user) {
      return res.status(400).send({ error: 'server is having an issue please try again later' })
    }
    return res.json(user)
  },

  async signup(req, res) {
    try {
      const user = await User.create(req.body)
      const userObjJson = user.toJSON();
      return res.send({
        user: userObjJson,
        token: jwtSignUser(userObjJson)
      })
    } catch (error) {
      if (Object.keys(error.keyValue[0] === 'email')) {
        return res.status(400).send({ error: 'This username already exist' })
      }
      return res.status(400).send({ error: 'something is wrong' })
    }
  },
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(403).send({ error: 'the login information is wrong' })
      }

      const isPasswordValid = await user.verfiyPassword(password);

      if (!isPasswordValid) {
        return res.status(403).send({ error: 'the login information is wrong' })
      }

      /** Original Jwt.Sign Expression **/
      const userObjJson = user.toJSON();
      return res.send({
        user: userObjJson,
        token: jwtSignUser(userObjJson)
      })
      /** Original Jwt.Sign Expression **/

      /** Loopedin SSO +Jwt.Sign Expression **/ 
      // const ONE_WEEK = 7 * 24 * 60 * 60; 
      // const userToken = jwt.sign(userObjJson, config.ssoToken, { expiresIn: ONE_WEEK }, {algorithm: 'HS256'});
      // const ssoRedirect = req.query.returnURL; 
      // return res.redirect(`${ssoRedirect}?token=${userToken}`); 
      /** Loopedin SSO +Jwt.Sign Expression **/
    } catch (error) {
      return res.status(500).send({ error: error })//'we have an error we don\'t know what to do' })
    }
  }
}