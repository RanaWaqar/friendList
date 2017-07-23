/*
 all the routes related to nodeJs
 */
function router() {
    const express = require('express');
    const router = express.Router();
    const controller = require('./controller');
    const passport = require('passport');
    const facebookStatergy = require('passport-facebook');
    const NODE_CONFIGRATIONS = require('../config/config');
    const model = require('./model');

    passport.use(new facebookStatergy(NODE_CONFIGRATIONS.PASSPORT, (accesstoken, refreshToken, profile, cb) => {
      cb(null, profile);
    }));

    router.post('/login', (req, res, next) => {
        controller(req).login(res);
    });

    router.post('/signup', (req, res, next) => {
        controller(req).signUp(res);
    });

    router.get('/appuser', (req, res, next) => {
        controller(req).getAllAppUsers(res);
    });

    router.post('/update/friendList', (req, res, next) => {
        controller(req).updateUser(res);
    });

    router.get('/single/friendList', (req, res, next) => {
        controller(req).getSingleFriendList(res);
    });
    router.get('/facebook/login', (req, res) => {
        controller(req).facebookLogin(res);
    });

    router.get('/jwt/verification', (req, res) => {
        controller(req).facebookVerification(res);
    });

    return router;
}

module.exports = router();