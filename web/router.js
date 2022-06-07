const Router = require('express').Router();

const authRoute = require('./routes/auth');

Router.use('/auth', authRoute);

module.exports = Router;