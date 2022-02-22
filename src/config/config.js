module.exports = {
  db: {
    mongoURI: `mongodb+srv://root-spenn:root123@cluster0.kk29x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
  },
  JwtSecret: process.env.JWT_SECRET || 'super_secret',
  ssoToken: '527b58bb-ddad-4751-b815-45f3fe377cb6'
}